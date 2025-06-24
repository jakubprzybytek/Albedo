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
      this.collectSpkCollection(rootTreeNode, []);
    }
  }

  buildCalculator(spkKernelCollection: SpkKernelCollection): PositionAndVelocityCalculator {
    switch (spkKernelCollection.dataType) {
      case DataType.ChebyshevPosition:
        return new PositionAndVelocitySolvingCalculator(spkKernelCollection.data);
      case DataType.ChebyshevPositionAndVelocity:
        return new PositionAndTrueVelocityCalculator(spkKernelCollection.data as PositionAndVelocityChebyshevRecord[]);
    }
  }

  collectSpkCollection(kernelTreeNode: TreeNode<JplBodyId, SpkKernelCollection>, allParentBodies: JplBodyId[]) {
    const allBodies = [...allParentBodies, kernelTreeNode.value];

    const newSpkNode: SpkNode = {
      targetBodyId: kernelTreeNode.value,
      observerBodyId: kernelTreeNode.incomingEdge?.centerBodyId,
      allBodies: [...allBodies],
      calculator: kernelTreeNode.incomingEdge ? this.buildCalculator(kernelTreeNode.incomingEdge) : undefined
    }

    this.spk.set(kernelTreeNode.value, newSpkNode);

    for (const childTreeNode of kernelTreeNode.children.values()) {
      this.collectSpkCollection(childTreeNode, allBodies);
    }
  }

  calculateDirectPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  findCommonAncestor(firstBodyIdies: JplBodyId[], secondBodyIdies: JplBodyId[]): JplBodyId | undefined {
    if (firstBodyIdies[0] !== secondBodyIdies[0]) {
      return undefined;
    }

    let i = 0;
    for (; i < firstBodyIdies.length && i < secondBodyIdies.length && firstBodyIdies[i] === secondBodyIdies[i]; i++) { /* empty */ }
    return firstBodyIdies[i - 1];
  }

  computeUncorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  calculateLightTimeCorrectedPosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number) {
    const targetPosition = this.computeUncorrectedPosition(targetBodyId, JplBodyId.SolarSystemBarycenter, es);
    const observerPosition = this.computeUncorrectedPosition(observerBodyId, JplBodyId.SolarSystemBarycenter, es);

    const observerToTargetCoords = targetPosition.subtract(observerPosition);
    const lightTime = observerToTargetCoords.length() / SPEED_OF_LIGHT;

    const correctedTargetPostion = this.computeUncorrectedPosition(targetBodyId, JplBodyId.SolarSystemBarycenter, es - lightTime);
    const correctedObserverToTargetCoords = correctedTargetPostion.subtract(observerPosition);

    return {
      coords: correctedObserverToTargetCoords,
      lightTime: correctedObserverToTargetCoords.length() / SPEED_OF_LIGHT
    }
  }

  computePosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): Position {
    switch (correction) {

      case CorrectionType2.LIGHT_TIME: {
        return this.calculateLightTimeCorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds);
      }

      default: {
        return {
          coords: this.computeUncorrectedPosition(targetBodyId, observerBodyId, ephemerisSeconds),
          lightTime: 0
        }
      }
    }
  }

  positionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): RectangularCoordinates {
    const { coords } = this.computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    return coords;
  }

  stateFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): State {
    const { coords: position, lightTime } = this.computePosition(targetBodyId, observerBodyId, ephemerisSeconds, correction);
    return {
      position,
      lightTime
    }
  }

}
