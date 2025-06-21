import { JplBodyId, SPEED_OF_LIGHT } from "@jpl";
import { DataType, PositionAndVelocityChebyshevRecord, SpkKernelCollection } from "@jpl/kernel";
import { Forest, TreeNode } from "@jpl/kernel/tree";
import { RectangularCoordinates } from "@astro/coords";
import { PositionAndTrueVelocityCalculator, PositionAndVelocityCalculator, PositionAndVelocitySolvingCalculator } from "../chebyshev";
import { CorrectionType2 } from ".";

type SpkNode = {
  targetBodyId: JplBodyId;
  observerBodyId?: JplBodyId;
  allBodies: JplBodyId[];
  calculator?: PositionAndVelocityCalculator;
};

export class StateSolver2 {

  readonly spk = new Map<JplBodyId, SpkNode>();

  constructor(kernel: Forest<JplBodyId, SpkKernelCollection>) {
    for (const rootTreeNode of kernel.trees.values()) {
      this.collectSpkCollection(rootTreeNode, []);
    }

    // for (const [objectId, node] of this.spk) {
    //   console.log(objectId, node.observerBodyId, node.allBodies);
    // }
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

  uncorrectedPositionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  positionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number, correction: CorrectionType2): RectangularCoordinates {
    switch (correction) {
      case CorrectionType2.NONE: {
        return this.uncorrectedPositionFor(targetBodyId, observerBodyId, ephemerisSeconds);
      }

      case CorrectionType2.LIGHT_TIME: {
        const targetPosition = this.uncorrectedPositionFor(targetBodyId, JplBodyId.SolarSystemBarycenter, ephemerisSeconds);
        const observerPosition = this.uncorrectedPositionFor(observerBodyId, JplBodyId.SolarSystemBarycenter, ephemerisSeconds);

        const observerToTargetCoords = targetPosition.subtract(observerPosition);
        const lightTime = observerToTargetCoords.length() / SPEED_OF_LIGHT;

        const correctedTargetPostion = this.uncorrectedPositionFor(targetBodyId, JplBodyId.SolarSystemBarycenter, ephemerisSeconds - lightTime);
        return correctedTargetPostion.subtract(observerPosition);
      }

      default: {
        return this.uncorrectedPositionFor(targetBodyId, observerBodyId, ephemerisSeconds);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  velocityFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    throw new Error("Method not implemented.");
  }

}
