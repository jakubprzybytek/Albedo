package jp.albedo.openngc;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;

class OpenNGCCatalogueLoaderTest {

    @Test
    void loadFile() throws URISyntaxException, IOException {
        final URL catalogueULR = OpenNGCCatalogueLoaderTest.class.getClassLoader().getResource("OpenNGC/NGC-sample.csv");
        Catalogue catalogue = OpenNGCCatalogueLoader.load(new File(catalogueULR.toURI()));

        assertEquals(2, catalogue.getAllEntries().size());

        CatalogueEntry firstEntry = catalogue.getAllEntries().get(0);
        assertEquals("IC0001", firstEntry.name);
        assertEquals("**", firstEntry.type);
        assertEquals((8.0 / 60 + 27.05 / 3600.0) * 15.0, firstEntry.rightAscention);
        assertEquals(27.0 + 43.0 / 60 + 3.6 / 3600.0, firstEntry.declination);

        CatalogueEntry secondEntry = catalogue.getAllEntries().get(1);
        assertEquals("IC0002", secondEntry.name);
        assertEquals("G", secondEntry.type);
        assertEquals((11.0 / 60 + 0.88 / 3600.0) * 15.0, secondEntry.rightAscention);
        assertEquals(-1.0 * (12.0 + 49.0 / 60 + 22.3 / 3600.0), secondEntry.declination);
    }

}