package jp.albedo.utils;

import java.util.LinkedList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collector;

public class Collectors {

    /**
     * Collector that can be used to generate part of the list that starts at the element that fulfil provided predicate.
     *
     * @param startCondition Predicate that indicates at which element should the resulting list start.
     * @param <T>            Type of the list elements.
     * @return Part of the input list that starts where predicate is true and ends with the end of original list.
     * Empty list if predicate doesn't give true for any list element.
     */
    public static <T> Collector<T, List<T>, List<T>> sublistWithStartingCondition(Predicate<T> startCondition) {
        return Collector.of(
                LinkedList<T>::new,
                (collected, item) -> {
                    if (!collected.isEmpty() || startCondition.test(item)) {
                        collected.add(item);
                    }
                },
                (left, right) -> {
                    left.addAll(right);
                    return left;
                }
        );
    }

}
