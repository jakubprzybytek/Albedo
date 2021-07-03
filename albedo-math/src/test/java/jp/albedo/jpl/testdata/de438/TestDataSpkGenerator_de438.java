package jp.albedo.jpl.testdata.de438;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

public class TestDataSpkGenerator_de438 {

    public static void main(String[] args) throws Exception {
        SpkKernelRepository kernel = new SpkKernelLoader()
                .forDateRange(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/jup365.bsp"))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/mar097.bsp"))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/de438t.bsp"))
                .kernel();

        System.out.printf("public class TestDataSpk_de438 {%n%n");

        generateSingleSpkKernelPositionRecord(
                "SUN_FOR_2019_10_09",
                kernel, JplBody.Sun, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "EARTH_MOON_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "EARTH_FOR_2019_10_09",
                kernel, JplBody.Earth, JplBody.EarthMoonBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "MOON_FOR_2019_10_09",
                kernel, JplBody.Moon, JplBody.EarthMoonBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "VENUS_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.VenusBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "VENUS_FOR_2019_10_09",
                kernel, JplBody.Venus, JplBody.VenusBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "MARS_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.MarsBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionAndVelocityRecord(
                "MARS_FOR_2019_10_09",
                kernel, JplBody.Mars, JplBody.MarsBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "JUPITER_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.JupiterBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelPositionRecord(
                "JUPITER_FOR_2019_10_09",
                kernel, JplBody.Jupiter, JplBody.JupiterBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        System.out.println("}\n");
    }

    private static void generateSingleSpkKernelPositionRecord(String spkRecordName, SpkKernelRepository kernel, JplBody target, JplBody observer, double jde) throws JplException {
        PositionChebyshevRecord record = kernel.getSpkKernelCollection(target, observer).getPositionData().stream()
                .filter(r -> r.getTimeSpan().inside(EphemerisSeconds.fromJde(jde)))
                .reduce((a, b) -> b)
                .orElseThrow();

        System.out.printf("\tpublic static SpkKernelCollection %s;%n%n", spkRecordName);
        System.out.println("\tstatic {");
        System.out.printf("\t\tTimeSpan timeSpan = new TimeSpan(%s, %s);%n",
                record.getTimeSpan().getFrom(), record.getTimeSpan().getTo());
        System.out.println("\t\tXYZCoefficients coefficients = new XYZCoefficients();");
        System.out.printf("\t\tcoefficients.x = new double[]{%s};%n\t\tcoefficients.y = new double[]{%s};%n\t\tcoefficients.z = new double[]{%s};%n",
                Arrays.stream(record.getPositionCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.println("\n\t\tList<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));");
        System.out.printf("\t\t%s = new SpkKernelCollection(JplBody.%s, JplBody.%s, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());%n",
                spkRecordName,
                target, observer);
        System.out.println("\t}\n");
    }

    private static void generateSingleSpkKernelPositionAndVelocityRecord(String spkRecordName, SpkKernelRepository kernel, JplBody target, JplBody observer, double jde) throws JplException {
        PositionAndVelocityChebyshevRecord record = kernel.getSpkKernelCollection(target, observer).getPositionAndVelocityData().stream()
                .filter(r -> r.getTimeSpan().inside(EphemerisSeconds.fromJde(jde)))
                .reduce((a, b) -> b)
                .orElseThrow();

        System.out.printf("\tpublic static SpkKernelCollection %s;%n%n", spkRecordName);
        System.out.println("\tstatic {");
        System.out.printf("\t\tTimeSpan timeSpan = new TimeSpan(%s, %s);%n",
                record.getTimeSpan().getFrom(), record.getTimeSpan().getTo());
        System.out.println("\t\tXYZCoefficients coefficients = new XYZCoefficients();");
        System.out.printf("\t\tcoefficients.x = new double[]{%s};%n\t\tcoefficients.y = new double[]{%s};%n\t\tcoefficients.z = new double[]{%s};%n",
                Arrays.stream(record.getPositionCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.println("\t\tXYZCoefficients velocityCoefficients = new XYZCoefficients();");
        System.out.printf("\t\tvelocityCoefficients.x = new double[]{%s};%n\t\tvelocityCoefficients.y = new double[]{%s};%n\t\tvelocityCoefficients.z = new double[]{%s};%n",
                Arrays.stream(record.getVelocityCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getVelocityCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getVelocityCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.println("\n\t\tList<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords = Collections.singletonList(new PositionAndVelocityChebyshevRecord(timeSpan, coefficients, velocityCoefficients));");
        System.out.printf("\t\t%s = new SpkKernelCollection(JplBody.%s, JplBody.%s, ReferenceFrame.J2000, Collections.emptyList(), positionAndVelocityChebyshevRecords);%n",
                spkRecordName,
                target, observer);
        System.out.println("\t}\n");
    }
}
