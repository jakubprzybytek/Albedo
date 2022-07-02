export class TreeNode<NodeType, EdgeType> {

    readonly value: NodeType;
    incomingEdge?: EdgeType;
    readonly children: Map<NodeType, TreeNode<NodeType, EdgeType>> = new Map();

    constructor(value: NodeType, incomingEdge?: EdgeType) {
        this.value = value;
        this.incomingEdge = incomingEdge;
    }

    setIncomingEdge(incomingEdge: EdgeType): void {
        if (this.incomingEdge != null) {
            throw Error('Node already has edge value!');
        }
        this.incomingEdge = incomingEdge;
    }

    append(nodeValue: NodeType, child: TreeNode<NodeType, EdgeType>): void {
        this.children.set(nodeValue, child);
    }

    hasChild(nodeValue: NodeType): boolean {
        return this.children.has(nodeValue);
    }

    getChild(nodeValue: NodeType): TreeNode<NodeType, EdgeType> | undefined {
        return this.children.get(nodeValue);
    }

    findNode(toFind: NodeType): TreeNode<NodeType, EdgeType> | undefined {
        if (this.children.has(toFind)) {
            return this.children.get(toFind);
        }

        return Array.from(this.children.values())
            .map((childNode) => childNode.findNode(toFind))
            .find((childNode) => childNode !== undefined);
    }

    findBranchTo(node: NodeType): TreeNode<NodeType, EdgeType>[] | undefined {
        if (this.value === node) {
            return [this];
        }

        const branch = Array.from(this.children.values())
            .map((childNode) => childNode.findBranchTo(node))
            .find((branch) => branch !== undefined);

        branch?.unshift(this);

        return branch;
    }

};
