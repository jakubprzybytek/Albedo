package jp.albedo.jpl;

import jp.albedo.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.files.Body;
import jp.albedo.jpl.files.DeAsciiFileReader;
import jp.albedo.jpl.impl.PositionCalculator;
import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class StateCalculator {

    private SPKernel spKernel;

    public void loadKernels(File asciiHeaderFile, File asciiFile) throws IOException {
        DeAsciiFileReader asciiFileReader = new DeAsciiFileReader();
        asciiFileReader.loadHeaderFile(asciiHeaderFile);
        asciiFileReader.loadFile(asciiFile);

        this.spKernel = asciiFileReader.createSPKernel();
    }

    public RectangularCoordinates computeForJd(Body body, double jde) throws JPLException {
        Map<TimeSpan, List<XYZCoefficients>> coefficientsByTime = this.spKernel.getCoefficientsForBody(body.index);

        PositionCalculator positionCalculator = new PositionCalculator(coefficientsByTime);
        return positionCalculator.compute(jde);
    }

}
