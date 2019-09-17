package jp.albedo.utils;

import org.apache.commons.math3.util.Pair;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MixListsSupplierTest {

    @Test
    public void mixingListSupplier() {
        List<String> list = Arrays.asList("A", "B", "C", "D");
        List<String> pairsString = Stream.generate(new MixListsSupplier<String>(list))
                .limit(6)
                .map(Pair::toString)
                .collect(Collectors.toList());

        assertEquals(Arrays.asList("[A, B]", "[A, C]", "[A, D]", "[B, C]", "[B, D]", "[C, D]"), pairsString);
    }

}