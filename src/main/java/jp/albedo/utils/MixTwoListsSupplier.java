package jp.albedo.utils;

import org.apache.commons.math3.util.Pair;

import java.util.Collection;
import java.util.Iterator;
import java.util.function.Supplier;

public class MixTwoListsSupplier<T> implements Supplier<Pair<T, T>> {

    final private Iterator<T> fistIterator;

    final private Collection<T> secondList;

    private Iterator<T> secondIterator;

    private T currentMainObject;

    public MixTwoListsSupplier(Collection<T> firstList, Collection<T> secondList) {
        this.fistIterator = firstList.iterator();
        this.currentMainObject = this.fistIterator.next();

        this.secondList = secondList;
        this.secondIterator = this.secondList.iterator();
    }

    @Override
    public Pair<T, T> get() {
        if (this.secondIterator.hasNext()) {
            return new Pair<>(this.currentMainObject, secondIterator.next());
        } else {
            if (this.fistIterator.hasNext()) {
                this.currentMainObject = this.fistIterator.next();
                this.secondIterator = this.secondList.iterator();
                return get();
            }
        }
        return null;
    }
}

