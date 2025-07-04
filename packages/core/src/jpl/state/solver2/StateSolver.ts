import { JplBodyId, SPEED_OF_LIGHT } from "@jpl";
import { DataType, PositionAndVelocityChebyshevRecord, SpkKernelCollection } from "@jpl/kernel";
import { Forest, TreeNode } from "@jpl/kernel/tree";
import { RectangularCoordinates } from "@astro/coords";
import { PositionAndTrueVelocityCalculator, PositionAndVelocityCalculator, PositionAndVelocitySolvingCalculator } from "../chebyshev";
import { CorrectionType2, State } from ".";

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

export class StateSolver2 {

  readonly spk = new Map<JplBodyId, SpkNode>();

  constructor(kernel: Forest<JplBodyId, SpkKernelCollection>) {
    for (const rootTreeNode of kernel.trees.values()) {
      this.#collectSpkCollection(rootTreeNode, []);
    }
  }

  #buildCalculator(spkKernelCollection: SpkKernelCollection): PositionAndVelocityCalculator {
    switch (spkKernelCollection.dataType) {
      case DataType.ChebyshevPosition:
        return new PositionAndVelocitySolvingCalculator(spkKernelCollection.data);
      case DataType.ChebyshevPositionAndVelocity:
        return new PositionAndTrueVelocityCalculator(spkKernelCollection.data as PositionAndVelocityChebyshevRecord[]);
    }
  }

  #collectSpkCollection(kernelTreeNode: TreeNode<JplBodyId, SpkKernelCollection>, allParentBodies: JplBodyId[]) {
    const allBodies = [...allParentBodies, kernelTreeNode.value];

    const newSpkNode: SpkNode = {
      targetBodyId: kernelTreeNode.value,
      observerBodyId: kernelTreeNode.incomingEdge?.centerBodyId,
      allBodies: [...allBodies],
      calculator: kernelTreeNode.incomingEdge ? this.#buildCalculator(kernelTreeNode.incomingEdge) : undefined
    }

    this.spk.set(kernelTreeNode.value, newSpkNode);

    for (const childTreeNode of kernelTreeNode.children.values()) {
      this.#collectSpkCollection(childTreeNode, allBodies);
    }
  }

  #calculateDirectPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  #calculateDirectVelocity(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  #computeUncorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    const targetsAllTransientBodies = this.spk.get(targetBodyId)?.allBodies;
    const obeserversAllTransientBodies = this.spk.get(observerBodyId)?.allBodies;

    if (targetsAllTransientBodies === undefined || obeserversAllTransientBodies === undefined) {
      throw new Error(`Cannot find spk collection either for '${targetBodyId}' or '${observerBodyId}'`);
    }

    const commonAncestor = this.findCommonAncestor(targetsAllTransientBodies, obeserversAllTransientBodies);

    if (commonAncestor === undefined) {
      throw new Error(`Bodies '${targetBodyId}' and '${observerBodyId}' don't have common ancestor!`);
    }

    const targetBodyPosition = this.#calculateDirectPosition(targetBodyId, commonAncestor, ephemerisSeconds);
    const observerBodyPosition = this.#calculateDirectPosition(observerBodyId, commonAncestor, ephemerisSeconds);

    return targetBodyPosition.subtract(observerBodyPosition);
  }

  #calculateLightTimeCorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, iterations: number): Position {
    const observerPosition = this.#computeUncorrectedPosition(observerBodyId, JplBodyId.SolarSystemBarycenter, es);

    let lightTime = 0;
    let targetPosition: RectangularCoordinates = RectangularCoordinates.ZERO;
    let observerToTargetCoords: RectangularCoordinates = RectangularCoordinates.ZERO;

    for (let i = 0; i < iterations; i++) {
      targetPosition = this.#computeUncorrectedPosition(targetBodyId, JplBodyId.SolarSystemBarycenter, es - lightTime);

      observerToTargetCoords = targetPosition.subtract(observerPosition);
      lightTime = observerToTargetCoords.length() / SPEED_OF_LIGHT;
    }

    return {
      coords: observerToTargetCoords,
      lightTime
    }
  }

  #computePosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): Position {
    switch (correction) {

      case CorrectionType2.LIGHT_TIME: {
        return this.#calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds, 2);
      }

      case CorrectionType2.CONVERGED_NEWTONIAN_LIGHT_TIME: {
        return this.#calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds, 4);
      }

      default: {
        return {
          coords: this.#computeUncorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds),
          lightTime: 0
        }
      }
    }
  }

  #computeVelocity(targetBodyId: JplBodyId, observerBodyId: JplBodyId, targetEphemerisSeconds: number, observerEphemerisSeconds: number): RectangularCoordinates {
    const targetsAllTransientBodies = this.spk.get(targetBodyId)?.allBodies;
    const obeserversAllTransientBodies = this.spk.get(observerBodyId)?.allBodies;

    if (targetsAllTransientBodies === undefined || obeserversAllTransientBodies === undefined) {
      throw new Error(`Cannot find spk collection either for '${targetBodyId}' or '${observerBodyId}'`);
    }

    const commonAncestor = this.findCommonAncestor(targetsAllTransientBodies, obeserversAllTransientBodies);

    if (commonAncestor === undefined) {
      throw new Error(`Bodies '${targetBodyId}' and '${observerBodyId}' don't have common ancestor!`);
    }

    const targetBodyPosition = this.#calculateDirectVelocity(targetBodyId, commonAncestor, targetEphemerisSeconds);
    const observerBodyPosition = this.#calculateDirectVelocity(observerBodyId, commonAncestor, observerEphemerisSeconds);

    return targetBodyPosition.subtract(observerBodyPosition);
  }

  positionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): RectangularCoordinates {
    const { coords } = this.#computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    return coords;
  }

  stateFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): State {
    const { coords: position, lightTime } = this.#computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    const velocity = this.#computeVelocity(targetBodyId, observerBodyId, ephemerisSeconds - lightTime, ephemerisSeconds);

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
