package jp.astro.vsop87.files;

import jp.astro.vsop87.Coefficients;
import jp.astro.vsop87.VSOP87Coefficients;
import jp.astro.vsop87.files.VSOP87Files;
import jp.astro.vsop87.files.VSOP87FilesLoader;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

class VSOP87FilesLoaderTest {

    @Test
    void load() throws IOException, URISyntaxException {
        System.out.println("Loading file: " + VSOP87Files.VSOP87B_EARTH);
        VSOP87Coefficients earthRectangularCoefficientsJ2000 = VSOP87FilesLoader.load(VSOP87Files.VSOP87B_EARTH);

        final List<List<Coefficients>> longitudeCoefficients = earthRectangularCoefficientsJ2000.getLongitudeCoefficients();
        System.out.println("Longitude term sets: " + longitudeCoefficients.size()
                + " (" + longitudeCoefficients.stream().map(list -> "" + list.size()).collect(Collectors.joining(", ")) + ")");

        for (int i = 0; i < 2; i++) {
            System.out.println(longitudeCoefficients.get(0).get(i).A + ", " +
                    longitudeCoefficients.get(0).get(i).B + ", " +
                    longitudeCoefficients.get(0).get(i).C);
        }

        final List<List<Coefficients>> latitudeCoefficients = earthRectangularCoefficientsJ2000.getLatitudeCoefficients();
        System.out.println("Latitude term sets: " + latitudeCoefficients.size()
                + " (" + latitudeCoefficients.stream().map(list -> "" + list.size()).collect(Collectors.joining(", ")) + ")");

        final List<List<Coefficients>> distanceCoefficients = earthRectangularCoefficientsJ2000.getDistanceCoefficients();
        System.out.println("Distance term sets: " + distanceCoefficients.size()
                + " (" + distanceCoefficients.stream().map(list -> "" + list.size()).collect(Collectors.joining(", ")) + ")");
    }
}