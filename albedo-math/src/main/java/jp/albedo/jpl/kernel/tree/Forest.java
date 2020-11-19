package jp.albedo.jpl.kernel.tree;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

public class Forest<T> {

    private final List<TreeNode<T>> trees = new ArrayList<>();

    public void addEdge(T target, T source) {
        Optional<TreeNode<T>> existingSourceNode = find(source, new LinkedList<>()); // TODO: unused list
        TreeNode<T> sourceNode = existingSourceNode.orElseGet(() -> new TreeNode<>(source));
        if (existingSourceNode.isEmpty()) {
            trees.add(sourceNode);
        }
        TreeNode<T> targetNode = new TreeNode<>(target);
        sourceNode.append(targetNode);
    }

    public List<T> findPathTo(T toFind) {
        LinkedList<T> path = new LinkedList<>();
        find(toFind, path);
        return path;
    }

    private Optional<TreeNode<T>> find(T toFind, LinkedList<T> path) {
        return trees.stream()
                .map(root -> root.find(toFind, path))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst();
    }

}
