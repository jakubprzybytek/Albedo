package jp.albedo.jpl.files;

import jp.albedo.jpl.impl.TimeSpan;
import jp.albedo.jpl.math.XYZCoefficients;
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

    AsciiFileReader asciiReader = new AsciiFileReader();

    @BeforeAll
    void loadFiles() throws URISyntaxException, IOException {
        final URL headerFileULR = AsciiFileReaderTest.class.getClassLoader().getResource("JPL/DE438/header.438");
        final URL fileULR = AsciiFileReaderTest.class.getClassLoader().getResource("JPL/DE438/ascp01950.438.sample");

        this.asciiReader.loadHeaderFile(new File(headerFileULR.toURI()));
        this.asciiReader.loadFile(new File(fileULR.toURI()));
    }

    @Test
    void testCoefficientsDescriptor() {
        assertEquals(15, this.asciiReader.contentDescriptor.size());

        final AsciiFileBodyCoefficientDescriptor firstBody = this.asciiReader.contentDescriptor.get(0);
        assertEquals(3, firstBody.getStartIndex());
        assertEquals(14, firstBody.getCoefficientNumber());
        assertEquals(4, firstBody.getSetsNumber());

        final AsciiFileBodyCoefficientDescriptor secondBody = this.asciiReader.contentDescriptor.get(1);
        assertEquals(171, secondBody.getStartIndex());
        assertEquals(10, secondBody.getCoefficientNumber());
        assertEquals(2, secondBody.getSetsNumber());
    }

    @Test
    void testCoefficientsMap() {
        assertEquals(15, this.asciiReader.coefficientsMap.size());

        Map<TimeSpan, List<XYZCoefficients>> firstBodyCoefficientsMap = asciiReader.getCoefficientsMapForIndex(0);

        assertEquals(2, firstBodyCoefficientsMap.size());

        final TimeSpan firstTimeSpan = new TimeSpan(2433264.5, 2433296.5);
        final TimeSpan secondTimeSpan = new TimeSpan(2433296.5, 2433328.5);

        assertNotNull(firstBodyCoefficientsMap.get(firstTimeSpan));
        assertNotNull(firstBodyCoefficientsMap.get(secondTimeSpan));

        final List<XYZCoefficients> firstBodyCoefficientsSet = firstBodyCoefficientsMap.get(firstTimeSpan);

        assertEquals(4, firstBodyCoefficientsSet.size());

        final XYZCoefficients firstCoefficients = firstBodyCoefficientsSet.get(0);
        assertEquals(44169514.68071251, firstCoefficients.x[0]);
        assertEquals(8080851.859133677, firstCoefficients.x[1]);
    }
}