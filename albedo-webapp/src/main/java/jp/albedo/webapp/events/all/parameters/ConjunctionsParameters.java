package jp.albedo.webapp.events.all.parameters;

public class ConjunctionsParameters {

    private final boolean sunEnabled;

    private final boolean moonEnabled;

    private final boolean planetsEnabled;

    private final boolean cometsEnabled;

    private final boolean asteroidsEnabled;

    private final boolean cataloguesDSEnabled;

    private final boolean filterBlindedBySun;

    public ConjunctionsParameters(boolean sunEnabled, boolean moonEnabled, boolean planetsEnabled, boolean cometsEnabled, boolean asteroidsEnabled, boolean cataloguesDSEnabled, boolean filterBlindedBySun) {
        this.sunEnabled = sunEnabled;
        this.moonEnabled = moonEnabled;
        this.planetsEnabled = planetsEnabled;
        this.cometsEnabled = cometsEnabled;
        this.asteroidsEnabled = asteroidsEnabled;
        this.cataloguesDSEnabled = cataloguesDSEnabled;
        this.filterBlindedBySun = filterBlindedBySun;
    }

    public boolean isSunEnabled() {
        return sunEnabled;
    }

    public boolean isMoonEnabled() {
        return moonEnabled;
    }

    public boolean arePlanetsEnabled() {
        return planetsEnabled;
    }

    public boolean areCometsEnabled() {
        return cometsEnabled;
    }

    public boolean areAsteroidsEnabled() {
        return asteroidsEnabled;
    }

    public boolean isCataloguesDSEnabled() {
        return cataloguesDSEnabled;
    }

    public boolean isFilterBlindedBySun() {
        return filterBlindedBySun;
    }
}
