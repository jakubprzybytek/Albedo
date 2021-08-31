package jp.albedo.jpl.kernel.tree;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.assertj.core.api.Assertions.assertThat;

public class ForestEdgesIteratorTest {

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

        ForestEdgesIterator<Integer, String> iterator = new ForestEdgesIterator<>(forest);

        List<String> nodes = StreamSupport.stream(Spliterators.spliteratorUnknownSize(iterator, Spliterator.DISTINCT), false)
                .collect(Collectors.toList());

        assertThat(nodes).containsExactlyInAnyOrder("12", "34", "25", "26", "17");
    }

}
