package jp.albedo.utils;

import org.apache.commons.math3.util.Pair;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MixTwoListsSupplierTest {

    @Test
    public void mixingTwoSmallListsSupplier() {
        List<String> first = Arrays.asList("A");
        List<String> second = Arrays.asList("C");
        List<String> pairsString = Stream.generate(new MixTwoListsSupplier<>(first, second))
                .limit(first.size() * second.size())
                .map(Pair::toString)
                .collect(Collectors.toList());

        assertEquals(Arrays.asList("[A, C]"), pairsString);
    }

    @Test
    public void mixingTwoListsSupplier() {
        List<String> first = Arrays.asList("A", "B");
        List<String> second = Arrays.asList("A", "C", "D");
        List<String> pairsString = Stream.generate(new MixTwoListsSupplier<>(first, second))
                .limit(first.size() * second.size())
                .map(Pair::toString)
                .collect(Collectors.toList());

        assertEquals(Arrays.asList("[A, A]", "[A, C]", "[A, D]", "[B, A]", "[B, C]", "[B, D]"), pairsString);
    }
}