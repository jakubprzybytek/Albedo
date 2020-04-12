package jp.albedo.openngc;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueEntryType;
import jp.albedo.catalogue.CatalogueName;
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
import java.util.stream.Collectors;

public class OpenNgcCatalogueLoader {

    final private static Log LOG = LogFactory.getLog(OpenNgcCatalogueLoader.class);

    final private List<OpenNgcCatalogueEntry> catalogueEntries = new ArrayList<>();

    public void load(File file) throws IOException {
        final Instant start = Instant.now();

        int loadedEntries = 0;
        int skippedEntries = 0;

        final FileReader fileReader = new FileReader(file);
        try (final BufferedReader bufferedReader = new BufferedReader(fileReader)) {
            // skip header
            String line = bufferedReader.readLine();

            while (loadedEntries < 14000 && (line = bufferedReader.readLine()) != null && !line.isEmpty()) {

                String[] values = line.split(";", -1);

                final String name = values[0];
                final String type = values[1];

                if ("NonEx".equals(type)) {
                    skippedEntries++;
                    continue;
                }

                final AstronomicalCoordinates coordinates = new AstronomicalCoordinates(
                        Math.toRadians(parseAngle(values[2]) * 15.0),
                        Math.toRadians(parseAngle(values[3]))
                );

                final Double majorAxisSize = !values[5].isEmpty() ? Double.parseDouble(values[5]) : null;
                final Double minorAxisSize = !values[6].isEmpty() ? Double.parseDouble(values[6]) : null;

                final Double bMagnitude = !values[8].isEmpty() ? Double.parseDouble(values[8]) : null;
                final Double vMagnitude = !values[9].isEmpty() ? Double.parseDouble(values[9]) : null;

                final String morphologicalType = !values[14].isEmpty() ? values[14] : null;

                final Integer messierNumber = !values[18].isEmpty() ? Integer.parseInt(values[18]) : null;

                this.catalogueEntries.add(new OpenNgcCatalogueEntry(name, parseType(type), coordinates, bMagnitude, vMagnitude, majorAxisSize, minorAxisSize, morphologicalType, messierNumber));
                loadedEntries++;
            }
        }

        LOG.info(String.format("Loaded %d and skipped %d catalogue entries from %s in %s", loadedEntries, skippedEntries, file.getAbsolutePath(), Duration.between(start, Instant.now())));
    }

    public Catalogue create(CatalogueName catalogueName) {
        if (this.catalogueEntries.isEmpty()) {
            throw new RuntimeException("Load catalogue file first!");
        }

        switch (catalogueName) {
            case NGC:
                final List<CatalogueEntry> ngcEntries = this.catalogueEntries.stream()
                        .filter(entry -> entry.name.startsWith("NGC"))
                        .map(entry -> new CatalogueEntry(entry.name, entry.type, entry.coordinates, entry.bMagnitude, entry.vMagnitude, entry.majorAxisSize, entry.minorAxisSize, entry.morphologicalType))
                        .collect(Collectors.toList());

                LOG.info(String.format("Created %s catalogue with %d entries", catalogueName, ngcEntries.size()));

                return new Catalogue(ngcEntries);
            case IC:
                final List<CatalogueEntry> icEntries = this.catalogueEntries.stream()
                        .filter(entry -> entry.name.startsWith("IC"))
                        .map(entry -> new CatalogueEntry(entry.name, entry.type, entry.coordinates, entry.bMagnitude, entry.vMagnitude, entry.majorAxisSize, entry.minorAxisSize, entry.morphologicalType))
                        .collect(Collectors.toList());

                LOG.info(String.format("Created %s catalogue with %d entries", catalogueName, icEntries.size()));

                return new Catalogue(icEntries);
            case Messier:
                final List<CatalogueEntry> messierEntries = this.catalogueEntries.stream()
                        .filter(entry -> entry.messierNumber != null)
                        .map(entry -> new CatalogueEntry("M" + entry.messierNumber, entry.type, entry.coordinates, entry.bMagnitude, entry.vMagnitude, entry.majorAxisSize, entry.minorAxisSize, entry.morphologicalType))
                        .collect(Collectors.toList());

                LOG.info(String.format("Created %s catalogue with %d entries", catalogueName, messierEntries.size()));

                return new Catalogue(messierEntries);
        }
        throw new RuntimeException("Unsupported type: " + catalogueName);
    }

    private static CatalogueEntryType parseType(String type) {
        switch (type) {
            case "*":
                return CatalogueEntryType.Star;
            case "**":
                return CatalogueEntryType.DoubleStar;
            case "*Ass":
                return CatalogueEntryType.AssociationOfStars;
            case "OCl":
                return CatalogueEntryType.OpenCluster;
            case "GCl":
                return CatalogueEntryType.GlobularCluster;
            case "Cl+N":
                return CatalogueEntryType.StarClusterPlusNebula;
            case "G":
                return CatalogueEntryType.Galaxy;
            case "GPair":
                return CatalogueEntryType.GalaxyPair;
            case "GTrpl":
                return CatalogueEntryType.GalaxyTriplet;
            case "GGroup":
                return CatalogueEntryType.GroupOfGalaxies;
            case "PN":
                return CatalogueEntryType.PlanetaryNebula;
            case "HII":
                return CatalogueEntryType.HII_IonizedRegion;
            case "DrkN":
                return CatalogueEntryType.DarkNebula;
            case "EmN":
                return CatalogueEntryType.EmissionNebula;
            case "Neb":
                return CatalogueEntryType.Nebula;
            case "RfN":
                return CatalogueEntryType.ReflectionNebula;
            case "SNR":
                return CatalogueEntryType.SuperNovaRemnant;
            case "Nova":
                return CatalogueEntryType.Nova;
            case "Dup":
                return CatalogueEntryType.DuplicatedObject;
            case "Other":
                return CatalogueEntryType.Other;
        }
        throw new RuntimeException("Unknown type: " + type);
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
