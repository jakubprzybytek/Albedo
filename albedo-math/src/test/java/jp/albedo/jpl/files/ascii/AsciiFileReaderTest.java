package jp.albedo.jpl.files.ascii;

import jp.albedo.jpl.JplConstantEnum;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.TimeSpan;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertAll;
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
        final Map<JplConstantEnum, Double> constants = this.asciiHeaderFileReader.getConstants();

        assertEquals(4, constants.size());

        assertEquals(299792.457999999984, constants.get(JplConstantEnum.SpeedOfLight));
        assertEquals(149597870.699999988, constants.get(JplConstantEnum.AU));
        assertEquals(81.3005683381650925, constants.get(JplConstantEnum.EarthMoonMassRatio));
        assertEquals(2.959122082855911E-4, constants.get(JplConstantEnum.GMSun));
    }

    @Test
    void testCoefficientsMap() {
        assertEquals(12, this.asciiReader.coefficientsMap.size());

        List<PositionChebyshevRecord> firstBodyCoefficientsMap = asciiReader.getCoefficientsMapForIndex(0);

        assertEquals(16, firstBodyCoefficientsMap.size());

        final TimeSpan firstTimeSpan = new TimeSpan(2433264.5, 2433272.5);
        final TimeSpan secondTimeSpan = new TimeSpan(2433272.5, 2433280.5);

        final PositionChebyshevRecord firstPositionChebyshevRecord = firstBodyCoefficientsMap.get(0);
        final PositionChebyshevRecord secondPositionChebyshevRecord = firstBodyCoefficientsMap.get(1);
        assertNotNull(firstPositionChebyshevRecord);
        assertNotNull(secondPositionChebyshevRecord);

        assertAll(
                () -> assertEquals(2433232.5, firstPositionChebyshevRecord.getTimeSpan().getFrom()),
                () -> assertEquals(2433240.5, firstPositionChebyshevRecord.getTimeSpan().getTo())
        );

        assertAll(
                () -> assertEquals(2433240.5, secondPositionChebyshevRecord.getTimeSpan().getFrom()),
                () -> assertEquals(2433248.5, secondPositionChebyshevRecord.getTimeSpan().getTo())
        );

        assertAll(
                () -> assertEquals(-4.807591310073455E7, firstPositionChebyshevRecord.getPositionCoefficients().x[0]),
                () -> assertEquals(7951556.07911521, firstPositionChebyshevRecord.getPositionCoefficients().x[1])
        );
    }
}