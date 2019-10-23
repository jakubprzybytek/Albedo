package jp.albedo.webapp.conjunctions.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;

public class LocalMinimumsFindingCollector<A, R> implements Collector<A, LocalMinimumsFindingCollector.CollectingContext<R>, List<R>> {

    final private Function<A, Double> valueProvider;

    //final private BiFunction<A, Double, R> resultProvider;
    final private Function<CollectingContext<R>, R> resultProvider;

    final private Function<A, Double> timestampProvider;

    private LocalMinimumsFindingCollector(Function<A, Double> valueProvider, Function<CollectingContext<R>, R> resultProvider, Function<A, Double> timestampProvider) {
        this.valueProvider = valueProvider;
        this.resultProvider = resultProvider;
        this.timestampProvider = timestampProvider;
    }

    public static <A, R> LocalMinimumsFindingCollector<A, R> of(Function<A, Double> valueProvider, Function<CollectingContext<R>, R> resultProvider, Function<A, Double> timestampProvider) {
        return new LocalMinimumsFindingCollector<>(valueProvider, resultProvider, timestampProvider);
    }

    @Override
    public Supplier<CollectingContext<R>> supplier() {
        return CollectingContext::new;
    }

    @Override
    public BiConsumer<CollectingContext<R>, A> accumulator() {
        return (findContext, item) -> {
            final double currentValue = this.valueProvider.apply(item);
            if (currentValue > findContext.lastMinValue) {
                if (!findContext.addedLocalMin) {
                    findContext.result.add(this.resultProvider.apply(findContext));
                    findContext.addedLocalMin = true;
                }
            } else {
                findContext.addedLocalMin = false;
            }
            findContext.lastMinValue = currentValue;
            findContext.lastJde = this.timestampProvider.apply(item);
        };
    }

    @Override
    public BinaryOperator<CollectingContext<R>> combiner() {
        return (a, b) -> {
            throw new RuntimeException("Cannot collect concurrent results");
        };
    }

    @Override
    public Function<CollectingContext<R>, List<R>> finisher() {
        return (findContext) -> findContext.result;
    }

    @Override
    public Set<Characteristics> characteristics() {
        return Collections.emptySet();
    }

    public static class CollectingContext<A> {

        public double lastMinValue = Double.MAX_VALUE;

        public double lastJde;

        boolean addedLocalMin;

        public List<A> result = new ArrayList<>();
    }
}