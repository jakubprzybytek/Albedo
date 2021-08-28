package jp.albedo.jpl.kernel.tree;

import java.util.Iterator;
import java.util.Optional;
import java.util.Stack;
import java.util.function.Function;

public class ForestEdgeVisitor<NodeType, EdgeType, ReturnType> {

    private final Stack<Iterator<TreeNode<NodeType, EdgeType>>> iteratorsStack = new Stack<>();

    private Iterator<TreeNode<NodeType, EdgeType>> currentIterator;

    private final Function<EdgeType, ReturnType> visitFunction;

    public ForestEdgeVisitor(Forest<NodeType, EdgeType> forest, Function<EdgeType, ReturnType> visitFunction) {
        this.visitFunction = visitFunction;
        this.currentIterator = forest.getTrees().values().iterator();
    }

    public Optional<ReturnType> visitNext() {

        if (currentIterator.hasNext()) {
            TreeNode<NodeType, EdgeType> node = currentIterator.next();
            EdgeType edge = node.getIncomingEdgeValue();

            iteratorsStack.push(node.getChildren().values().iterator());

            if (edge != null) { // ToDo: edge != null - seriously?
                return Optional.of(visitFunction.apply(edge));
            }

            return visitNext();
        } else {
            if (!iteratorsStack.empty()) {
                currentIterator = iteratorsStack.pop();
                return visitNext();
            }
        }

        return Optional.empty();
    }

}
