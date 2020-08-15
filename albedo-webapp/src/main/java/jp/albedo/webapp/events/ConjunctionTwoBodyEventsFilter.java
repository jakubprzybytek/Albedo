package jp.albedo.webapp.events;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.webapp.conjunctions.Conjunction;

import java.util.function.Predicate;

public class ConjunctionTwoBodyEventsFilter implements Predicate<Conjunction<BodyDetails, BodyDetails>> {

    final private boolean filterBlindedBySun;

    public ConjunctionTwoBodyEventsFilter(boolean filterBlindedBySun) {
        this.filterBlindedBySun = filterBlindedBySun;
    }

    @Override
    public boolean test(Conjunction<BodyDetails, BodyDetails> conj) {

        if (this.filterBlindedBySun) {
            if ((BodyInformation.Sun.name().equals(conj.firstObject.name) && conj.firstObjectEphemeris.distanceFromEarth < conj.secondObjectEphemeris.distanceFromEarth) ||
                    (BodyInformation.Sun.name().equals(conj.secondObject.name) && conj.secondObjectEphemeris.distanceFromEarth < conj.firstObjectEphemeris.distanceFromEarth)) {
                return false;
            }
        }

        return true;
    }

}
