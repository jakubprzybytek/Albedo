package jp.albedo.catalogue;

import java.util.List;

public class Catalogue {

    final private List<CatalogueEntry> catalogueEntries;

    public Catalogue(List<CatalogueEntry> catalogueEntries) {
        this.catalogueEntries = catalogueEntries;
    }

    public List<CatalogueEntry> getAllEntries() {
        return catalogueEntries;
    }

}
