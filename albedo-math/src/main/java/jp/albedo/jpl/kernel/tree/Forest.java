package jp.albedo.jpl.kernel.tree;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public class Forest<NodeType, EdgeType> {

    private final Map<NodeType, TreeNode<NodeType, EdgeType>> trees = new HashMap<>();

    public void addEdge(NodeType from, NodeType to, EdgeType edgeValue) {

        // look if 'from' node already exist
        Optional<TreeNode<NodeType, EdgeType>> existingFromNode = find(from);
        TreeNode<NodeType, EdgeType> fromNode = existingFromNode.orElseGet(() -> new TreeNode<>(from, null));

        if (existingFromNode.isEmpty()) {
            trees.put(from, fromNode);
        } else {
            if (fromNode.hasChild(to)) {
                throw new IllegalStateException(String.format("Node %s already has %s child!", from, to));
            }
        }

        TreeNode<NodeType, EdgeType> toNode;

        // look if 'to' node already exist as tree root, merge it does
        if (trees.containsKey(to)) {
            toNode = trees.get(to);
            toNode.setIncomingEdgeValue(edgeValue);
            trees.remove(to);
        } else {
            toNode = new TreeNode<>(to, edgeValue);
        }

        fromNode.append(to, toNode);
    }

    public Optional<List<NodeType>> findPathTo(NodeType toFind) {
        return findBranch(toFind).map(treeNodes -> treeNodes.stream()
                .map(TreeNode::getNodeValue)
                .filter(Objects::nonNull)
                .collect(Collectors.toList()));
    }

    public Optional<List<EdgeType>> findEdgesTo(NodeType toFind) {
        final Optional<List<EdgeType>> edges = findBranch(toFind).map(treeNodes -> treeNodes.stream()
                .map(TreeNode::getIncomingEdgeValue)
                .filter(Objects::nonNull)
                .collect(Collectors.toList()));

        return edges.isPresent() && edges.get().size() == 0 ? Optional.empty() : edges;
    }

    private Optional<LinkedList<TreeNode<NodeType, EdgeType>>> findBranch(NodeType toFind) {
        return trees.values().stream()
                .map(childNode -> childNode.findBranch(toFind))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst();
    }

    private Optional<TreeNode<NodeType, EdgeType>> find(NodeType toFind) {
        return findBranch(toFind)
                .map(LinkedList::getLast);
    }

}
