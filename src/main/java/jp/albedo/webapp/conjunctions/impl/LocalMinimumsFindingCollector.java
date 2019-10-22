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

public class LocalMinimumsFindingCollector<A, R> implements Collector<A, LocalMinimumsFindingCollector.ConjunctionFindingContext<R>, List<R>> {

    final private Function<A, Double> valueProvider;

    final private Function<ConjunctionFindingContext<R>, R> resultProvider;

    final private Function<A, Double> timestampProvider;

    private LocalMinimumsFindingCollector(Function<A, Double> valueProvider, Function<ConjunctionFindingContext<R>, R> resultProvider, Function<A, Double> timestampProvider) {
        this.valueProvider = valueProvider;
        this.resultProvider = resultProvider;
        this.timestampProvider = timestampProvider;
    }

    public static <A, R> LocalMinimumsFindingCollector<A, R> of(Function<A, Double> valueProvider, Function<ConjunctionFindingContext<R>, R> resultProvider, Function<A, Double> timestampProvider) {
        return new LocalMinimumsFindingCollector<>(valueProvider, resultProvider, timestampProvider);
    }

    @Override
    public Supplier<ConjunctionFindingContext<R>> supplier() {
        return ConjunctionFindingContext::new;
    }

    @Override
    public BiConsumer<ConjunctionFindingContext<R>, A> accumulator() {
        return (findContext, item) -> {
            final double separation = this.valueProvider.apply(item);
            if (separation > findContext.lastMinSeparation) {
                if (!findContext.addedLocalMin) {
                    findContext.result.add(this.resultProvider.apply(findContext));
                    findContext.addedLocalMin = true;
                }
            } else {
                findContext.addedLocalMin = false;
            }
            findContext.lastMinSeparation = separation;
            findContext.lastJde = this.timestampProvider.apply(item);
        };
    }

    @Override
    public BinaryOperator<ConjunctionFindingContext<R>> combiner() {
        return (a, b) -> {
            throw new RuntimeException("Cannot collect concurrent results");
        };
    }

    @Override
    public Function<ConjunctionFindingContext<R>, List<R>> finisher() {
        return (findContext) -> findContext.result;
    }

    @Override
    public Set<Characteristics> characteristics() {
        return Collections.emptySet();
    }

    public static class ConjunctionFindingContext<A> {

        public double lastMinSeparation = Double.MAX_VALUE;

        public double lastJde;

        boolean addedLocalMin;

        public List<A> result = new ArrayList<>();
    }
}