package jp.albedo.openngc;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.AstronomicalCoordinates;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class OpenNgcCatalogueLoader {

    private static Log LOG = LogFactory.getLog(OpenNgcCatalogueLoader.class);

    public static Catalogue load(File file) throws IOException {
        final Instant start = Instant.now();

        final List<CatalogueEntry> catalogueEntries = new ArrayList<>();

        int loadedEntries = 0;
        int skippedEntries = 0;

        final FileReader fileReader = new FileReader(file);
        try (final BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            // skip header
            String line = bufferedReader.readLine();

            while (loadedEntries < 14000 && (line = bufferedReader.readLine()) != null && !line.isEmpty()) {

                String[] values = line.split(";");

                String type = values[1];

                if ("NonEx".equals(type)) {
                    skippedEntries++;
                    continue;
                }

                catalogueEntries.add(new CatalogueEntry(
                        values[0],
                        type,
                        new AstronomicalCoordinates(
                                Math.toRadians(parseAngle(values[2]) * 15.0),
                                Math.toRadians(parseAngle(values[3]))
                        )
                ));
                loadedEntries++;
            }
        }

        LOG.info(String.format("Loaded %d and skipped %d catalogue entries in %s", catalogueEntries.size(), skippedEntries, Duration.between(start, Instant.now())));

        return new Catalogue(catalogueEntries);
    }

    private static double parseAngle(String angleString) {
        double sign = angleString.startsWith("-") ? -1.0 : 1.0;

        String strippedAngleString = angleString.startsWith("+") || angleString.startsWith("-") ? angleString.substring(1) : angleString;
        String[] hourAngleParts = strippedAngleString.split(":");
        return sign * (Double.parseDouble(hourAngleParts[0])
                + Double.parseDouble(hourAngleParts[1]) / 60.0
                + Double.parseDouble(hourAngleParts[2]) / 3600.0);
    }

}
