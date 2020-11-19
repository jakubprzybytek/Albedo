package jp.albedo.jpl.kernel.tree;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

public class TreeNode<T> {

    private final T value;

    private final List<TreeNode<T>> children = new ArrayList<>();

    public TreeNode(T value) {
        this.value = value;
    }

    public void append(TreeNode<T> child) {
        children.add(child);
    }

    public Optional<TreeNode<T>> find(T toFind, LinkedList<T> path) {
        if (value.equals(toFind)) {
            path.add(value);
            return Optional.of(this);
        }
        return children.stream()
                .map(child -> child.find(toFind, path))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .peek((r) -> path.addFirst(value))
                .findFirst();
    }

}
