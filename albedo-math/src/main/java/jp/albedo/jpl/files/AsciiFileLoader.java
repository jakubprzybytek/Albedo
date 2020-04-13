package jp.albedo.jpl.files;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SPKernel;
import jp.albedo.jpl.files.impl.AsciiFileReader;
import jp.albedo.jpl.files.impl.AsciiHeaderFileReader;

import java.io.File;
import java.io.IOException;

public class AsciiFileLoader {

    private AsciiHeaderFileReader asciiHeaderFileReader;

    private AsciiFileReader asciiFileReader;

    public void loadHeader(File asciiHeaderFile) throws IOException, JplException {
        if (this.asciiFileReader != null) {
            throw new JplException("Header file already loaded!");
        }

        this.asciiHeaderFileReader = new AsciiHeaderFileReader();
        this.asciiHeaderFileReader.loadHeaderFile(asciiHeaderFile);

        this.asciiFileReader = new AsciiFileReader(this.asciiHeaderFileReader.getContentDescriptor());
    }

    public void load(File asciiFile) throws IOException, JplException {
        if (this.asciiFileReader == null) {
            throw new JplException("Load Header file first!");
        }

        this.asciiFileReader.loadFile(asciiFile);
    }

    public SPKernel createSpKernel() {
        SPKernel spKernel = new SPKernel();

        spKernel.addConstants(this.asciiHeaderFileReader.getConstants());

        spKernel.registerBodyCoefficients(JplBody.Mercury, this.asciiFileReader.getCoefficientsMapForIndex(0));
        spKernel.registerBodyCoefficients(JplBody.Venus, this.asciiFileReader.getCoefficientsMapForIndex(1));
        spKernel.registerBodyCoefficients(JplBody.EarthMoonBarycenter, this.asciiFileReader.getCoefficientsMapForIndex(2));
        spKernel.registerBodyCoefficients(JplBody.Mars, this.asciiFileReader.getCoefficientsMapForIndex(3));
        spKernel.registerBodyCoefficients(JplBody.Jupiter, this.asciiFileReader.getCoefficientsMapForIndex(4));
        spKernel.registerBodyCoefficients(JplBody.Saturn, this.asciiFileReader.getCoefficientsMapForIndex(5));
        spKernel.registerBodyCoefficients(JplBody.Uranus, this.asciiFileReader.getCoefficientsMapForIndex(6));
        spKernel.registerBodyCoefficients(JplBody.Neptune, this.asciiFileReader.getCoefficientsMapForIndex(7));
        spKernel.registerBodyCoefficients(JplBody.Pluto, this.asciiFileReader.getCoefficientsMapForIndex(8));
        spKernel.registerBodyCoefficients(JplBody.Moon, this.asciiFileReader.getCoefficientsMapForIndex(9)); // a.r.f Earth
        spKernel.registerBodyCoefficients(JplBody.Sun, this.asciiFileReader.getCoefficientsMapForIndex(10));

        return spKernel;
    }

}
