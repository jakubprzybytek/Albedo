package jp.albedo.jpl.kernel.tree;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;

public class TreeNode<NodeType, EdgeType> {

    private final NodeType nodeValue;

    private EdgeType incomingEdgeValue;

    private final Map<NodeType, TreeNode<NodeType, EdgeType>> children = new HashMap<>();

    public TreeNode(NodeType nodeValue, EdgeType incomingEdgeValue) {
        this.nodeValue = nodeValue;
        this.incomingEdgeValue = incomingEdgeValue;
    }

    public void append(NodeType nodeValue, TreeNode<NodeType, EdgeType> child) {
        children.put(nodeValue, child);
    }

    public boolean hasChild(NodeType nodeValue) {
        return children.containsKey(nodeValue);
    }

    public NodeType getNodeValue() {
        return nodeValue;
    }

    public void setIncomingEdgeValue(EdgeType incomingEdgeValue) {
        if (this.incomingEdgeValue != null) {
            throw new IllegalStateException("Node already has edge value!");
        }
        this.incomingEdgeValue = incomingEdgeValue;
    }

    public EdgeType getIncomingEdgeValue() {
        return incomingEdgeValue;
    }

    public Optional<LinkedList<TreeNode<NodeType, EdgeType>>> findBranch(NodeType toFind) {
        if (nodeValue.equals(toFind)) {
            return Optional.of(new LinkedList<>(Collections.singletonList(this)));
        }

        return children.values().stream()
                .map(childNode -> childNode.findBranch(toFind))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .peek(branch -> branch.addFirst(this))
                .findFirst();
    }

    public Optional<TreeNode<NodeType, EdgeType>> find(NodeType toFind, LinkedList<NodeType> path) {
        if (children.containsKey(toFind)) {
            path.addFirst(toFind);
            return Optional.of(children.get(toFind));
        }
        for (NodeType nodeValue : children.keySet()) {
            Optional<TreeNode<NodeType, EdgeType>> foundNode = children.get(nodeValue).find(toFind, path);
            if (foundNode.isPresent()) {
                path.addFirst(nodeValue);
                return foundNode;
            }
        }
        return Optional.empty();
    }

}
