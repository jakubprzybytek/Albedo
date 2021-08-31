package jp.albedo.jpl.kernel.tree;

import java.util.Iterator;
import java.util.Stack;

public class ForestEdgesIterator<NodeType, EdgeType> implements Iterator<EdgeType> {

    private final Stack<Iterator<TreeNode<NodeType, EdgeType>>> iteratorsStack = new Stack<>();

    private Iterator<TreeNode<NodeType, EdgeType>> currentIterator;

    public ForestEdgesIterator(Forest<NodeType, EdgeType> forest) {
        this.currentIterator = forest.getTrees().values().iterator();
    }

    @Override
    public boolean hasNext() {
        if (currentIterator.hasNext()) {
            return true;
        }

        if (!iteratorsStack.empty()) {
            currentIterator = iteratorsStack.pop();
            return hasNext();
        }

        return false;
    }

    @Override
    public EdgeType next() {
        TreeNode<NodeType, EdgeType> node = currentIterator.next();
        EdgeType edge = node.getIncomingEdgeValue();

        iteratorsStack.push(node.getChildren().values().iterator());

        if (edge != null) { // ToDo: edge != null - seriously?
            return edge;
        }

        if (hasNext()) {
            return next();
        }

        return null; // FixMe
    }

}
