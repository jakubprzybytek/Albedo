package jp.albedo.utils;

import org.apache.commons.math3.util.Pair;

import java.util.Collection;
import java.util.Iterator;
import java.util.function.Supplier;

/**
 * Takes two collections as input and then it produces pairs of elements on each-on-each basis.
 * <p>
 * As a infinite Supplier, it needs to be limited to n * m elements.
 *
 * @param <A>
 * @param <B>
 */
public class MixTwoListsSupplier<A, B> implements Supplier<Pair<A, B>> {

    final private Iterator<A> fistIterator;

    final private Collection<B> secondList;

    private Iterator<B> secondIterator;

    private A currentMainObject;

    public MixTwoListsSupplier(Collection<A> firstList, Collection<B> secondList) {
        this.fistIterator = firstList.iterator();
        this.currentMainObject = this.fistIterator.next();

        this.secondList = secondList;
        this.secondIterator = this.secondList.iterator();
    }

    @Override
    public Pair<A, B> get() {
        if (this.secondIterator.hasNext()) {
            return new Pair<>(this.currentMainObject, secondIterator.next());
        } else {
            if (this.fistIterator.hasNext()) {
                this.currentMainObject = this.fistIterator.next();
                this.secondIterator = this.secondList.iterator();
                return get();
            }
        }

        throw new RuntimeException("Supplier exhausted!");
    }
}

