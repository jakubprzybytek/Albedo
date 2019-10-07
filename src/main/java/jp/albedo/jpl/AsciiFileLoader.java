package jp.albedo.jpl;

import jp.albedo.jpl.files.AsciiFileReader;
import jp.albedo.jpl.files.AsciiHeaderFileReader;

import java.io.File;
import java.io.IOException;

public class AsciiFileLoader {

    private AsciiHeaderFileReader asciiHeaderFileReader;

    private AsciiFileReader asciiFileReader;

    public void loadHeader(File asciiHeaderFile) throws IOException, JPLException {
        if (this.asciiFileReader != null) {
            throw new JPLException("Header file already loaded!");
        }

        this.asciiHeaderFileReader = new AsciiHeaderFileReader();
        this.asciiHeaderFileReader.loadHeaderFile(asciiHeaderFile);

        this.asciiFileReader = new AsciiFileReader(this.asciiHeaderFileReader.getContentDescriptor());
    }

    public void load(File asciiFile) throws IOException, JPLException {
        if (this.asciiFileReader == null) {
            throw new JPLException("Load Header file first!");
        }

        this.asciiFileReader.loadFile(asciiFile);
    }

    public SPKernel createSpKernel() {
        SPKernel spKernel = new SPKernel();
        spKernel.registerBodyCoefficients(Body.Mercury, this.asciiFileReader.getCoefficientsMapForIndex(0));
        spKernel.registerBodyCoefficients(Body.Venus, this.asciiFileReader.getCoefficientsMapForIndex(1));
        spKernel.registerBodyCoefficients(Body.EarthMoonBarycenter, this.asciiFileReader.getCoefficientsMapForIndex(2));
        spKernel.registerBodyCoefficients(Body.Mars, this.asciiFileReader.getCoefficientsMapForIndex(3));

        return spKernel;
    }

}
