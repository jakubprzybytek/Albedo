package jp.albedo.webapp.conjunctions.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;

public class LocalMinimumsFindingCollector<A, R> implements Collector<A, LocalMinimumsFindingCollector.CollectingContext<A, R>, List<R>> {

    final private Function<A, Double> valueProvider;

    final private BiFunction<A, Double, R> resultProvider;

    private LocalMinimumsFindingCollector(Function<A, Double> valueProvider, BiFunction<A, Double, R> resultProvider) {
        this.valueProvider = valueProvider;
        this.resultProvider = resultProvider;
    }

    public static <A, R> LocalMinimumsFindingCollector<A, R> of(Function<A, Double> valueProvider, BiFunction<A, Double, R> resultProvider) {
        return new LocalMinimumsFindingCollector<>(valueProvider, resultProvider);
    }

    @Override
    public Supplier<CollectingContext<A, R>> supplier() {
        return CollectingContext::new;
    }

    @Override
    public BiConsumer<CollectingContext<A, R>, A> accumulator() {
        return (findContext, item) -> {
            final double currentValue = this.valueProvider.apply(item);
            if (currentValue > findContext.lastMinValue) {
                if (!findContext.addedLocalMin) {
                    findContext.result.add(this.resultProvider.apply(findContext.lastObject, findContext.lastMinValue));
                    findContext.addedLocalMin = true;
                }
            } else {
                findContext.addedLocalMin = false;
            }
            findContext.lastMinValue = currentValue;
            findContext.lastObject = item;
        };
    }

    @Override
    public BinaryOperator<CollectingContext<A, R>> combiner() {
        return (a, b) -> {
            throw new RuntimeException("Cannot collect concurrent results");
        };
    }

    @Override
    public Function<CollectingContext<A, R>, List<R>> finisher() {
        return (findContext) -> findContext.result;
    }

    @Override
    public Set<Characteristics> characteristics() {
        return Collections.emptySet();
    }

    public static class CollectingContext<A, R> {

        double lastMinValue = Double.MAX_VALUE;

        A lastObject;

        boolean addedLocalMin;

        public List<R> result = new ArrayList<>();
    }
}