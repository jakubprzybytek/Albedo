import { Radians, RectangularCoordinates } from "@astro/coords";
import { JplBodyId, SPEED_OF_LIGHT } from "@jpl";
import { DataType, PositionAndVelocityChebyshevRecord, SpkKernelCollection } from "@jpl/kernel";
import { CorrectionType, State } from "@jpl/state";
import { PositionAndTrueVelocityCalculator, PositionAndVelocityCalculator, PositionAndVelocitySolvingCalculator } from "@jpl/state/chebyshev";

type SpkNode = {
  targetBodyId: JplBodyId;
  observerBodyId?: JplBodyId;
  allBodies: JplBodyId[];
  calculator?: PositionAndVelocityCalculator;
};

type Position = {
  coords: RectangularCoordinates;
  lightTime: number;
}

export class StateSolver {

  readonly spk = new Map<JplBodyId, SpkNode>();

  constructor(kernels: SpkKernelCollection[]) {
    const centerBodies = kernels.reduce((acc, kernel) => acc.set(kernel.bodyId, kernel.centerBodyId), new Map<JplBodyId, JplBodyId>);

    this.spk.set(JplBodyId.SolarSystemBarycenter, {
      targetBodyId: JplBodyId.SolarSystemBarycenter,
      allBodies: [JplBodyId.SolarSystemBarycenter]
    });

    for (let kernel of kernels) {
      const newSpkNode: SpkNode = {
        targetBodyId: kernel.bodyId,
        observerBodyId: kernel.centerBodyId,
        allBodies: this.collectParentBodies(kernel.bodyId, centerBodies),
        calculator: this.buildCalculator(kernel)
      }
      this.spk.set(kernel.bodyId, newSpkNode);
    }
  }

  private collectParentBodies(targetBodyId: JplBodyId, centerBodies: Map<JplBodyId, JplBodyId>): JplBodyId[] {
    const parentBodies: JplBodyId[] = [targetBodyId];
    let bodyId = targetBodyId;
    let centerBody;
    while ((centerBody = centerBodies.get(bodyId)) !== undefined) {
      parentBodies.push(centerBody);
      bodyId = centerBody;
    }
    return parentBodies.reverse();
  }

  private buildCalculator(spkKernelCollection: SpkKernelCollection): PositionAndVelocityCalculator {
    switch (spkKernelCollection.dataType) {
      case DataType.ChebyshevPosition:
        return new PositionAndVelocitySolvingCalculator(spkKernelCollection.data);
      case DataType.ChebyshevPositionAndVelocity:
        return new PositionAndTrueVelocityCalculator(spkKernelCollection.data as PositionAndVelocityChebyshevRecord[]);
    }
  }

  private calculateDirectPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    let resultingPosition = RectangularCoordinates.ZERO;

    let currentBodyId: JplBodyId | undefined = targetBodyId;
    while (currentBodyId !== undefined && currentBodyId !== observerBodyId) {
      const spkNode = this.spk.get(currentBodyId);
      if (spkNode === undefined) {
        throw new Error(`Cannot find node for targetId='${currentBodyId}'`);
      }

      if (spkNode.calculator !== undefined) {
        try {
          const position = spkNode.calculator.positionFor(ephemerisSeconds);
          resultingPosition = resultingPosition.add(position);
        } catch (error) {
          throw Error(`Cannot calculate position for bodyId='${currentBodyId}'`, { cause: error });
        }
      }

      currentBodyId = spkNode.observerBodyId;
    };

    return resultingPosition;
  }

  private calculateDirectVelocity(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    let resultingPosition = RectangularCoordinates.ZERO;

    let currentBodyId: JplBodyId | undefined = targetBodyId;
    while (currentBodyId !== undefined && currentBodyId !== observerBodyId) {
      const spkNode = this.spk.get(currentBodyId);
      if (spkNode === undefined) {
        throw new Error(`Cannot find node for targetId='${currentBodyId}'`);
      }

      if (spkNode.calculator !== undefined) {
        try {
          const position = spkNode.calculator.velocityFor(ephemerisSeconds);
          resultingPosition = resultingPosition.add(position);
        } catch (error) {
          throw Error(`Cannot calculate position for bodyId='${currentBodyId}'`, { cause: error });
        }
      }

      currentBodyId = spkNode.observerBodyId;
    };

    return resultingPosition;
  }

  findCommonAncestor(firstBodyIdies: JplBodyId[], secondBodyIdies: JplBodyId[]): JplBodyId | undefined {
    if (firstBodyIdies[0] !== secondBodyIdies[0]) {
      return undefined;
    }

    let i = 0;
    for (; i < firstBodyIdies.length && i < secondBodyIdies.length && firstBodyIdies[i] === secondBodyIdies[i]; i++) { /* empty */ }
    return firstBodyIdies[i - 1];
  }

  private computeUncorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    const targetsAllTransientBodies = this.spk.get(targetBodyId)?.allBodies;
    const obeserversAllTransientBodies = this.spk.get(observerBodyId)?.allBodies;

    if (targetsAllTransientBodies === undefined || obeserversAllTransientBodies === undefined) {
      throw new Error(`Cannot find spk collection either for '${targetBodyId}' or '${observerBodyId}'`);
    }

    const commonAncestor = this.findCommonAncestor(targetsAllTransientBodies, obeserversAllTransientBodies);

    if (commonAncestor === undefined) {
      throw new Error(`Bodies '${targetBodyId}' and '${observerBodyId}' don't have common ancestor!`);
    }

    const targetBodyPosition = this.calculateDirectPosition(targetBodyId, commonAncestor, ephemerisSeconds);
    const observerBodyPosition = this.calculateDirectPosition(observerBodyId, commonAncestor, ephemerisSeconds);

    return targetBodyPosition.subtract(observerBodyPosition);
  }

  private calculateLightTimeCorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, iterations: number): Position {
    const observerPosition = this.computeUncorrectedPosition(observerBodyId, JplBodyId.SolarSystemBarycenter, es);

    let lightTime = 0;
    let targetPosition: RectangularCoordinates = RectangularCoordinates.ZERO;
    let observerToTargetCoords: RectangularCoordinates = RectangularCoordinates.ZERO;

    for (let i = 0; i < iterations; i++) {
      targetPosition = this.computeUncorrectedPosition(targetBodyId, JplBodyId.SolarSystemBarycenter, es - lightTime);

      observerToTargetCoords = targetPosition.subtract(observerPosition);
      lightTime = observerToTargetCoords.length() / SPEED_OF_LIGHT;
    }

    return {
      coords: observerToTargetCoords,
      lightTime
    }
  }

  private computePosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType): Position {
    switch (correction) {

      case CorrectionType.LIGHT_TIME: {
        return this.calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds, 2);
      }

      case CorrectionType.CONVERGED_NEWTONIAN_LIGHT_TIME: {
        return this.calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds, 4);
      }

      case CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION: {
        const { coords: observetToTargetPosition, lightTime } = this.calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds, 2);
        const observerVelocity = this.calculateDirectVelocity(observerBodyId, JplBodyId.SolarSystemBarycenter, ephemerisSeconds);

        const angle = Radians.between(observerVelocity, observetToTargetPosition);
        const aberrationAngle = Math.asin(observerVelocity.length() * Math.sin(angle) / SPEED_OF_LIGHT);

        const rotationVector = observetToTargetPosition.crossProduct(observerVelocity);
        const correctedPosition = observetToTargetPosition.rotate(rotationVector, aberrationAngle);
        return {
          coords: correctedPosition,
          lightTime
        }
      }

      default: {
        return {
          coords: this.computeUncorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds),
          lightTime: 0
        }
      }
    }
  }

  private computeVelocity(targetBodyId: JplBodyId, observerBodyId: JplBodyId, targetEphemerisSeconds: number, observerEphemerisSeconds: number): RectangularCoordinates {
    const targetsAllTransientBodies = this.spk.get(targetBodyId)?.allBodies;
    const obeserversAllTransientBodies = this.spk.get(observerBodyId)?.allBodies;

    if (targetsAllTransientBodies === undefined || obeserversAllTransientBodies === undefined) {
      throw new Error(`Cannot find spk collection either for '${targetBodyId}' or '${observerBodyId}'`);
    }

    const commonAncestor = this.findCommonAncestor(targetsAllTransientBodies, obeserversAllTransientBodies);

    if (commonAncestor === undefined) {
      throw new Error(`Bodies '${targetBodyId}' and '${observerBodyId}' don't have common ancestor!`);
    }

    const targetBodyVelocity = this.calculateDirectVelocity(targetBodyId, commonAncestor, targetEphemerisSeconds);
    const observerBodyVelocity = this.calculateDirectVelocity(observerBodyId, commonAncestor, observerEphemerisSeconds);

    return targetBodyVelocity.subtract(observerBodyVelocity);
  }

  positionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType): RectangularCoordinates {
    const { coords } = this.computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    return coords;
  }

  stateFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType): State {
    const { coords: position, lightTime } = this.computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    const velocity = this.computeVelocity(targetBodyId, observerBodyId, ephemerisSeconds - lightTime, ephemerisSeconds);

    // const { coords: position1, lightTime: lightTime1 } = this.#computePosition(targetBodyId, observerBodyId, ephemerisSeconds - 20, correction);
    // const { coords: position2, lightTime: lightTime2 } = this.#computePosition(targetBodyId, observerBodyId, ephemerisSeconds + 20, correction);
    // const velocity = new RectangularCoordinates(
    //   (position2.x - position1.x) / (2 * 20),
    //   (position2.y - position1.y) / (2 * 20),
    //   (position2.z - position1.z) / (2 * 20)
    // );
    return {
      position,
      velocity,
      lightTime
    }
  }

}
