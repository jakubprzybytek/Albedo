package jp.albedo.webapp.catalogue;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueName;
import jp.albedo.openngc.OpenNgcCatalogueLoader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class DsoCatalogueRepository {

    @Value("${openNGC.files}")
    private String openNGCFiles;

    final private Map<CatalogueName, Catalogue> catalogueMap = new HashMap<>();

    private synchronized Catalogue loadOpenNgcCatalogue(CatalogueName catalogueName) throws IOException {

        if (this.catalogueMap.containsKey(catalogueName)) {
            return this.catalogueMap.get(catalogueName);
        }

        final OpenNgcCatalogueLoader loader = new OpenNgcCatalogueLoader();
        for (String fineName : this.openNGCFiles.split(",")) {
            loader.load(new File(fineName));
        }

        this.catalogueMap.put(CatalogueName.Messier, loader.create(CatalogueName.Messier));
        this.catalogueMap.put(CatalogueName.NGC, loader.create(CatalogueName.NGC));
        this.catalogueMap.put(CatalogueName.IC, loader.create(CatalogueName.IC));

        return this.catalogueMap.get(catalogueName);
    }

    public Catalogue getCatalogue(CatalogueName catalogueName) throws IOException {
        if (!this.catalogueMap.containsKey(catalogueName)) {
            return loadOpenNgcCatalogue(catalogueName);
        }

        return this.catalogueMap.get(catalogueName);
    }

}
