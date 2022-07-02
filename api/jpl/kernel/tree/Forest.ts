import { TreeNode } from './TreeNode';

export class Forest<NodeType, EdgeType> {

    readonly trees: Map<NodeType, TreeNode<NodeType, EdgeType>> = new Map();

    addEdge(from: NodeType, to: NodeType, edgeValue: EdgeType): void {

        // look if 'from' node already exist
        const existingFromNode = this.findNode(from);
        const fromNode = existingFromNode || new TreeNode<NodeType, EdgeType>(from);

        if (existingFromNode === undefined) {
            this.trees.set(from, fromNode);
        } else {
            if (fromNode.hasChild(to)) {
                throw Error(`Node ${from} already has ${to} child!`);
            }
        }

        let toNode = this.trees.get(to)

        // look if 'to' node already exist as tree root, merge if it does
        if (toNode !== undefined) {
            toNode.setIncomingEdge(edgeValue);
            this.trees.delete(to);
        } else {
            toNode = new TreeNode(to, edgeValue);
        }

        fromNode.append(to, toNode);
    }

    findEdge(from: NodeType, to: NodeType): EdgeType | undefined {
        const fromNode = this.findNode(from);

        if (fromNode === undefined) {
            return undefined;
        }

        return fromNode.getChild(to)?.incomingEdge;
    }

    findNode(node: NodeType): TreeNode<NodeType, EdgeType> | undefined {
        if (this.trees.has(node)) {
            return this.trees.get(node);
        }

        return Array.from(this.trees.values())
            .map((rootNode) => rootNode.findNode(node))
            .find((rootNode) => rootNode !== undefined);
    }

    findPathTo(node: NodeType): NodeType[] | undefined {
        return this.findBranchTo(node)
            ?.map((node) => node.value);
    }

    findEdgesTo(node: NodeType): EdgeType[] | undefined {
        const edges = this.findBranchTo(node)
            ?.map((node) => node.incomingEdge)
            .filter((incomindEdge): incomindEdge is EdgeType => incomindEdge !== undefined);

        return edges && edges.length > 0 ? edges : undefined;
    }

    private findBranchTo(node: NodeType): TreeNode<NodeType, EdgeType>[] | undefined {
        return Array.from(this.trees.values())
            .map((rootNode) => rootNode.findBranchTo(node))
            .find((rootNode) => rootNode !== undefined);
    }
};
