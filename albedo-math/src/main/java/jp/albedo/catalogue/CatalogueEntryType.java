package jp.albedo.catalogue;

public enum CatalogueEntryType {
    Star("Star"),
    DoubleStar("Double star"),
    AssociationOfStars("Association of stars"),
    OpenCluster("Open Cluster"),
    GlobularCluster("Globular Cluster"),
    StarClusterPlusNebula("Star Cluster plus Nebula"),
    Galaxy("Galaxy"),
    GalaxyPair("Galaxy pair"),
    GalaxyTriplet("Galaxy triplet"),
    GroupOfGalaxies("Group of galaxies"),
    PlanetaryNebula("Planetary nebula"),
    HII_IonizedRegion("HII ionized region"),
    DarkNebula("Dark Nebula"),
    EmissionNebula("Emission Nebula"),
    Nebula("Nebula"),
    ReflectionNebula("Reflection nebula"),
    SuperNovaRemnant("Supernova remnant"),
    Nova("Nova"),
    DuplicatedObject("Duplicated Object"),
    Other("Other");

    private final String description;

    CatalogueEntryType(String description) {
        this.description = description;
    }

}
