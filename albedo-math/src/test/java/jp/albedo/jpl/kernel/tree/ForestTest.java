package jp.albedo.jpl.kernel.tree;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class ForestTest {

    /**
     * 1 -> 2 -> 5
     * \  \-> 6
     * \-> 7
     * 3 -> 4
     */
    @Test
    public void simpleTest() {
        Forest<Integer, String> forest = new Forest<>();
        forest.addEdge(1, 2, "12");
        forest.addEdge(3, 4, "34");
        forest.addEdge(2, 5, "25");
        forest.addEdge(2, 6, "26");
        forest.addEdge(1, 7, "17");

        assertThat(forest.findPathTo(0)).isEmpty();
        assertThat(forest.findEdgesTo(0)).isEmpty();

        assertThat(forest.findPathTo(1)).hasValue(Collections.singletonList(1));
        assertThat(forest.findEdgesTo(1)).isEmpty();

        assertThat(forest.findPathTo(2)).hasValue(Arrays.asList(1, 2));
        assertThat(forest.findEdgesTo(2)).isPresent().hasValue(new LinkedList<>(Collections.singletonList("12")));

        assertThat(forest.findPathTo(5)).hasValue(Arrays.asList(1, 2, 5));
        assertThat(forest.findEdgesTo(5)).isPresent().hasValue(new LinkedList<>(Arrays.asList("12", "25")));

        assertThat(forest.findPathTo(6)).hasValue(Arrays.asList(1, 2, 6));
        assertThat(forest.findEdgesTo(6)).isPresent().hasValue(new LinkedList<>(Arrays.asList("12", "26")));

        assertThat(forest.findPathTo(7)).hasValue(Arrays.asList(1, 7));
        assertThat(forest.findEdgesTo(7)).isPresent().hasValue(new LinkedList<>(Collections.singletonList("17")));


        assertThat(forest.findPathTo(3)).hasValue(Collections.singletonList(3));
        assertThat(forest.findEdgesTo(3)).isEmpty();

        assertThat(forest.findPathTo(4)).hasValue(Arrays.asList(3, 4));
        assertThat(forest.findEdgesTo(4)).isPresent().hasValue(new LinkedList<>(Collections.singletonList("34")));
    }

    @Test
    public void testAddingDuplicates() {
        Forest<Integer, String> forest = new Forest<>();
        forest.addEdge(1, 2, "12");

        assertThatThrownBy(() -> forest.addEdge(1, 2, "12")).isInstanceOf(IllegalStateException.class);
    }

    /**
     * 1 -> 2
     * \-> 3
     * 4 -> 5
     */
    @Test
    public void testMerging() {
        Forest<Integer, String> forest = new Forest<>();
        // first tree
        forest.addEdge(1, 2, "12");
        forest.addEdge(1, 3, "13");
        // second tree
        forest.addEdge(4, 5, "45");

        // merge trees
        forest.addEdge(3, 4, "34");

        assertThat(forest.findPathTo(4)).hasValue(Arrays.asList(1, 3, 4));
        assertThat(forest.findEdgesTo(4)).isPresent().hasValue(new LinkedList<>(Arrays.asList("13", "34")));

        assertThat(forest.findPathTo(5)).hasValue(Arrays.asList(1, 3, 4, 5));
        assertThat(forest.findEdgesTo(5)).isPresent().hasValue(new LinkedList<>(Arrays.asList("13", "34", "45")));
    }

    @Test
    public void testNewRoot() {
        Forest<Integer, String> forest = new Forest<>();
        forest.addEdge(2, 3, "23");
        forest.addEdge(1, 2, "12");

        assertThat(forest.findPathTo(1)).hasValue(Collections.singletonList(1));
        assertThat(forest.findEdgesTo(1)).isEmpty();

        assertThat(forest.findPathTo(2)).hasValue(Arrays.asList(1, 2));
        assertThat(forest.findEdgesTo(2)).isPresent().hasValue(new LinkedList<>(Collections.singletonList("12")));

        assertThat(forest.findPathTo(3)).hasValue(Arrays.asList(1, 2, 3));
        assertThat(forest.findEdgesTo(3)).isPresent().hasValue(new LinkedList<>(Arrays.asList("12", "23")));
    }
}
