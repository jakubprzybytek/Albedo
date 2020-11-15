package jp.albedo.jpl.files.ascii;

import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AsciiFileReaderTest {

    AsciiHeaderFileReader asciiHeaderFileReader;

    AsciiFileReader asciiReader;

    @BeforeAll
    void loadFiles() throws URISyntaxException, IOException {
        final URL headerFileULR = AsciiFileReaderTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = AsciiFileReaderTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        this.asciiHeaderFileReader = new AsciiHeaderFileReader();
        this.asciiHeaderFileReader.loadHeaderFile(new File(headerFileULR.toURI()));

        this.asciiReader = new AsciiFileReader(this.asciiHeaderFileReader.getContentDescriptor());
        this.asciiReader.loadFile(new File(fileULR.toURI()));
    }

    @Test
    void testCoefficientsDescriptor() {
        final List<AsciiFileBodyCoefficientDescriptor> contentDescriptor = this.asciiHeaderFileReader.getContentDescriptor();

        assertEquals(15, contentDescriptor.size());

        final AsciiFileBodyCoefficientDescriptor firstBody = contentDescriptor.get(0);
        assertEquals(3, firstBody.getStartIndex());
        assertEquals(14, firstBody.getCoefficientNumber());
        assertEquals(4, firstBody.getSetsNumber());

        final AsciiFileBodyCoefficientDescriptor secondBody = contentDescriptor.get(1);
        assertEquals(171, secondBody.getStartIndex());
        assertEquals(10, secondBody.getCoefficientNumber());
        assertEquals(2, secondBody.getSetsNumber());
    }

    @Test
    void testConstants() {
        final Map<JplConstant, Double> constants = this.asciiHeaderFileReader.getConstants();

        assertEquals(4, constants.size());

        assertEquals(299792.457999999984, constants.get(JplConstant.SpeedOfLight));
        assertEquals(149597870.699999988, constants.get(JplConstant.AU));
        assertEquals(81.3005683381650925, constants.get(JplConstant.EarthMoonMassRatio));
        assertEquals(2.959122082855911E-4, constants.get(JplConstant.GMSun));
    }

    @Test
    void testCoefficientsMap() {
        assertEquals(12, this.asciiReader.coefficientsMap.size());

        Map<TimeSpan, XYZCoefficients> firstBodyCoefficientsMap = asciiReader.getCoefficientsMapForIndex(0);

        assertEquals(16, firstBodyCoefficientsMap.size());

        final TimeSpan firstTimeSpan = new TimeSpan(2433264.5, 2433272.5);
        final TimeSpan secondTimeSpan = new TimeSpan(2433272.5, 2433280.5);

        assertNotNull(firstBodyCoefficientsMap.get(firstTimeSpan));
        assertNotNull(firstBodyCoefficientsMap.get(secondTimeSpan));

        final XYZCoefficients firstBodyCoefficients = firstBodyCoefficientsMap.get(firstTimeSpan);

        assertEquals(44169514.68071251, firstBodyCoefficients.x[0]);
        assertEquals(8080851.859133677, firstBodyCoefficients.x[1]);
    }
}