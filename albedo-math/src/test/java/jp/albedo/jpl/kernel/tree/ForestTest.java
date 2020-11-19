package jp.albedo.jpl.kernel.tree;

import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

public class ForestTest {

    /**
     * 1 -> 2 -> 5
     *   \  \-> 6
     *    \-> 7
     * 3 -> 4
     */
    @Test
    public void test() {
        Forest<Integer> forest = new Forest<>();
        forest.addEdge(2, 1);
        forest.addEdge(4, 3);
        forest.addEdge(5, 2);
        forest.addEdge(6, 2);
        forest.addEdge(7, 1);

        assertThat(forest.findPathTo(0)).isEmpty();

        assertThat(forest.findPathTo(1)).isEqualTo(Arrays.asList(1));
        assertThat(forest.findPathTo(2)).isEqualTo(Arrays.asList(1, 2));
        assertThat(forest.findPathTo(5)).isEqualTo(Arrays.asList(1, 2, 5));
        assertThat(forest.findPathTo(6)).isEqualTo(Arrays.asList(1, 2, 6));
        assertThat(forest.findPathTo(7)).isEqualTo(Arrays.asList(1, 7));

        assertThat(forest.findPathTo(3)).isEqualTo(Arrays.asList(3));
        assertThat(forest.findPathTo(4)).isEqualTo(Arrays.asList(3, 4));
    }

    @Test
    public void testAddingDuplicates() {
        Forest<Integer> forest = new Forest<>();
        forest.addEdge(2, 1);
        forest.addEdge(2, 1);
    }

}
