package jp.albedo.vsop87;

import java.util.LinkedList;
import java.util.List;

public class VSOP87Coefficients {


    private List<List<Coefficients>> longitudeCoefficients = new LinkedList<>();

    private List<List<Coefficients>> latitudeCoefficients = new LinkedList<>();

    private List<List<Coefficients>> distanceCoefficients = new LinkedList<>();

    public VSOP87Coefficients(List<List<Coefficients>> longitudeCoefficients, List<List<Coefficients>> latitudeCoefficients, List<List<Coefficients>> distanceCoefficients) {
        this.longitudeCoefficients = longitudeCoefficients;
        this.latitudeCoefficients = latitudeCoefficients;
        this.distanceCoefficients = distanceCoefficients;
    }

    public List<List<Coefficients>> getLongitudeCoefficients() {
        return longitudeCoefficients;
    }

    public List<List<Coefficients>> getLatitudeCoefficients() {
        return latitudeCoefficients;
    }

    public List<List<Coefficients>> getDistanceCoefficients() {
        return distanceCoefficients;
    }
}
