package jp.albedo.openngc;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueEntryType;
import jp.albedo.catalogue.CatalogueType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class OpenNgcCatalogueLoaderTest {

    private Catalogue catalogue;

    @BeforeEach
    void setUp() throws URISyntaxException, IOException {
        final OpenNgcCatalogueLoader loader = new OpenNgcCatalogueLoader();

        final URL catalogueULR = OpenNgcCatalogueLoaderTest.class.getClassLoader().getResource("OpenNGC/NGC-sample.csv");
        loader.load(new File(catalogueULR.toURI()));

        this.catalogue = loader.create(CatalogueType.IC);
    }

    @Test
    void loadFile() {

        assertEquals(2, catalogue.getAllEntries().size());

        CatalogueEntry firstEntry = catalogue.getAllEntries().get(0);
        assertEquals("IC0001", firstEntry.name);
        assertEquals(CatalogueEntryType.DoubleStar, firstEntry.type);
        assertEquals(Math.toRadians((8.0 / 60 + 27.05 / 3600.0) * 15.0), firstEntry.coordinates.rightAscension);
        assertEquals(Math.toRadians(27.0 + 43.0 / 60 + 3.6 / 3600.0), firstEntry.coordinates.declination);
        assertEquals(null, firstEntry.majorAxisSize);
        assertEquals(null, firstEntry.minorAxisSize);
        assertEquals(null, firstEntry.bMagnitude);
        assertEquals(null, firstEntry.vMagnitude);
        assertNull(firstEntry.morphologicalType);

        CatalogueEntry secondEntry = catalogue.getAllEntries().get(1);
        assertEquals("IC0002", secondEntry.name);
        assertEquals(CatalogueEntryType.Galaxy, secondEntry.type);
        assertEquals(Math.toRadians((11.0 / 60 + 0.88 / 3600.0) * 15.0), secondEntry.coordinates.rightAscension);
        assertEquals(Math.toRadians(-1.0 * (12.0 + 49.0 / 60 + 22.3 / 3600.0)), secondEntry.coordinates.declination);
        assertEquals(0.98, secondEntry.majorAxisSize);
        assertEquals(0.32, secondEntry.minorAxisSize);
        assertEquals(15.46, secondEntry.bMagnitude);
        assertEquals(null, secondEntry.vMagnitude);
        assertEquals("Sb", secondEntry.morphologicalType);
    }

}