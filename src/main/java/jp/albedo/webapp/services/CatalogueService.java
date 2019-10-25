package jp.albedo.webapp.services;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueType;
import jp.albedo.openngc.OpenNgcCatalogueLoader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CatalogueService {

    @Value("${openNGC.fileName}")
    private String openNGCFileName;

    final private Map<CatalogueType, Catalogue> catalogueMap = new HashMap<>();

    private synchronized Catalogue loadOpenNgcCatalogue(CatalogueType catalogueType) throws IOException {

        if (this.catalogueMap.containsKey(catalogueType)) {
            return this.catalogueMap.get(catalogueType);
        }

        final OpenNgcCatalogueLoader loader = new OpenNgcCatalogueLoader();
        loader.load(new File(this.openNGCFileName));

        this.catalogueMap.put(CatalogueType.NGC, loader.create(CatalogueType.NGC));
        this.catalogueMap.put(CatalogueType.IC, loader.create(CatalogueType.IC));

        return this.catalogueMap.get(catalogueType);
    }

    public Catalogue getCatalogue(CatalogueType catalogueType) throws IOException {
        if (!this.catalogueMap.containsKey(catalogueType)) {
            return loadOpenNgcCatalogue(catalogueType);
        }

        return this.catalogueMap.get(catalogueType);
    }


}
