package jp.albedo.jpl.kernel.tree;

import java.util.Iterator;
import java.util.Stack;

public class ForestNodesIterator<NodeType, EdgeType> implements Iterator<NodeType> {

    private final Stack<Iterator<TreeNode<NodeType, EdgeType>>> iteratorsStack = new Stack<>();

    private Iterator<TreeNode<NodeType, EdgeType>> currentIterator;

    public ForestNodesIterator(Forest<NodeType, EdgeType> forest) {
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
    public NodeType next() {
        TreeNode<NodeType, EdgeType> node = currentIterator.next();
        NodeType nodeElement = node.getNodeValue();

        iteratorsStack.push(node.getChildren().values().iterator());

        return nodeElement;
    }

}
