package jp.albedo.jpl.kernel.tree;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.assertj.core.api.Assertions.assertThat;

public class ForestNodesIteratorTest {

    /**
     * 1 -> 2 -> 5
     * \  \-> 6
     * \-> 7
     * 3 -> 4
     */
    @Test
    void testIterator() {
        Forest<Integer, String> forest = new Forest<>();
        forest.addEdge(1, 2, "12");
        forest.addEdge(3, 4, "34");
        forest.addEdge(2, 5, "25");
        forest.addEdge(2, 6, "26");
        forest.addEdge(1, 7, "17");

        ForestNodesIterator<Integer, String> iterator = new ForestNodesIterator<>(forest);

        List<Integer> nodes = StreamSupport.stream(Spliterators.spliteratorUnknownSize(iterator, Spliterator.DISTINCT), false)
                .collect(Collectors.toList());

        assertThat(nodes).containsExactlyInAnyOrder(1, 2, 3, 4, 5, 6, 7);
    }

}
