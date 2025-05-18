import { JplBodyId } from "@jpl";
import { DataType, PositionAndVelocityChebyshevRecord, SpkKernelCollection } from "@jpl/kernel";
import { Forest, TreeNode } from "@jpl/kernel/tree";
import { RectangularCoordinates } from "@astro/coords";
import { StateSolver } from "..";
import { PositionAndTrueVelocityCalculator, PositionAndVelocityCalculator, PositionAndVelocitySolvingCalculator } from "../chebyshev";

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

    for (const [objectId, node] of this.spk) {
      console.log(objectId, node.observerBodyId, node.allBodies);
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
        const position = spkNode.calculator.positionFor(ephemerisSeconds);
        resultingPosition = resultingPosition.add(position);
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
    for (; i < firstBodyIdies.length && i < secondBodyIdies.length && firstBodyIdies[i] === secondBodyIdies[i]; i++) { }
    return firstBodyIdies[i - 1];
  }

  positionFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
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

  velocityFor(targetBodyId: JplBodyId, observerBodyId: JplBodyId, ephemerisSeconds: number): RectangularCoordinates {
    throw new Error("Method not implemented.");
  }

}
