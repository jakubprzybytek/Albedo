package jp.albedo.webapp.services;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.openngc.OpenNgcCatalogueLoader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class CatalogueService {

    @Value("${openNGC.fileName}")
    private String openNGCFileName;

    private Catalogue openNgcCatalogue;

    private synchronized Catalogue loadOpenNgcCatalogue() throws IOException {

        if (this.openNgcCatalogue != null) {
            return this.openNgcCatalogue;
        }

        return OpenNgcCatalogueLoader.load(new File(this.openNGCFileName));
    }

    public Catalogue getOpenNgcCatalogue() throws IOException {
        if (this.openNgcCatalogue == null) {
            this.openNgcCatalogue = loadOpenNgcCatalogue();
        }

        return this.openNgcCatalogue;
    }
}
