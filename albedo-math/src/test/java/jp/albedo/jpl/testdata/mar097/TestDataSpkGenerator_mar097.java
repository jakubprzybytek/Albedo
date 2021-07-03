package jp.albedo.jpl.testdata.mar097;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.testdata.utils.RecordGenerator;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class TestDataSpkGenerator_mar097 {

    public static void main(String[] args) throws Exception {
        SpkKernelRepository kernel = new SpkKernelLoader()
                .forDateRange(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/mar097.bsp"))
                .kernel();

        StringBuilder output = new StringBuilder();

        output.append("package jp.albedo.jpl.testdata.mar097;\n\n");

        output.append("import jp.albedo.jpl.JplBody;\n");
        output.append("import jp.albedo.jpl.files.binary.ReferenceFrame;\n");
        output.append("import jp.albedo.jpl.kernel.PositionChebyshevRecord;\n");
        output.append("import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;\n");
        output.append("import jp.albedo.jpl.kernel.SpkKernelCollection;\n");
        output.append("import jp.albedo.jpl.kernel.TimeSpan;\n");
        output.append("import jp.albedo.jpl.kernel.XYZCoefficients;\n");

        output.append("import java.util.Collections;\n");
        output.append("import java.util.ArrayList;\n");
        output.append("import java.util.List;\n\n");

        output.append("public class TestDataSpk_mar097 {\n\n");

        RecordGenerator.generatePositionOnlyCollection(output,
                "SUN_FOR_2019_10_09",
                kernel, JplBody.Sun, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        RecordGenerator.generatePositionOnlyCollection(output,
                "EARTH_MOON_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        RecordGenerator.generatePositionOnlyCollection(output,
                "EARTH_FOR_2019_10_09",
                kernel, JplBody.Earth, JplBody.EarthMoonBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        RecordGenerator.generatePositionOnlyCollection(output,
                "MARS_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.MarsBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        RecordGenerator.generatePositionAndVelocityCollection(output,
                "MARS_FOR_2019_10_09",
                kernel, JplBody.Mars, JplBody.MarsBarycenter,
                new TimeSpan(
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 8)),
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));

        RecordGenerator.generatePositionAndVelocityCollection(output,
                "PHOBOS_FOR_2019_10_09",
                kernel, JplBody.Phobos, JplBody.MarsBarycenter,
                new TimeSpan(
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 8)),
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));

        RecordGenerator.generatePositionAndVelocityCollection(output,
                "DEIMOS_FOR_2019_10_09",
                kernel, JplBody.Deimos, JplBody.MarsBarycenter,
                new TimeSpan(
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 8)),
                        EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9))));

        output.append("}\n");

        System.out.println(output);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter("./TestDataSpk_mar097.java"))) {
            writer.write(output.toString());
        }
    }

}
