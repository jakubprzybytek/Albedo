package jp.albedo.webapp.events;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyInformation;
import jp.albedo.webapp.conjunctions.Conjunction;

import java.util.function.Predicate;

public class ConjunctionBodyAndCatalogueEventsFilter implements Predicate<Conjunction<BodyDetails, CatalogueEntry>> {

    final private boolean filterBlindedBySun;

    public ConjunctionBodyAndCatalogueEventsFilter(boolean filterBlindedBySun) {
        this.filterBlindedBySun = filterBlindedBySun;
    }

    @Override
    public boolean test(Conjunction<BodyDetails, CatalogueEntry> conj) {

        if (this.filterBlindedBySun) {
            if (BodyInformation.Sun.name().equals(conj.firstObject.name)) {
                return false;
            }
        }

        return true;
    }

}
