package jp.albedo.utils;

import org.apache.commons.math3.util.Pair;

import java.util.*;
import java.util.function.Supplier;

public class MixListSupplier<T> implements Supplier<Pair<T, T>> {

    final private Iterator<T> mainIterator;

    final private Queue<T> supportingQueue;

    private T currentMainObject;

    private Iterator<T> supportingIterator;

    public MixListSupplier(List<T> list) {
        this.mainIterator = list.iterator();
        this.currentMainObject = this.mainIterator.next();
        this.supportingQueue = new ArrayDeque<>(list);
        this.supportingQueue.remove();
        this.supportingIterator = this.supportingQueue.iterator();
    }

    @Override
    public Pair<T, T> get() {
        if (this.supportingIterator.hasNext()) {
            return new Pair<>(this.currentMainObject, supportingIterator.next());
        } else {
            if (this.mainIterator.hasNext()) {
                this.currentMainObject = this.mainIterator.next();
                this.supportingQueue.remove();
                this.supportingIterator = this.supportingQueue.iterator();
                return get();
            }
        }
        return null;
    }
}

