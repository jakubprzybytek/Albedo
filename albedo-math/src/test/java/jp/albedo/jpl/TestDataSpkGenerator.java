package jp.albedo.jpl;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

public class TestDataSpkGenerator {

    public static void main(String[] args) throws Exception {
        SpkKernelRepository kernel = new SpkKernelLoader()
                .forDateRange(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/jup365.bsp"))
                .load(new File("d:/Workspace/Java/Albedo/misc/de438/de438t.bsp"))
//                .load(new File("d:/Workspace/Java/Albedo/misc/de438/mar097.bsp"))
                .kernel();

        System.out.printf("public class TestDataSpk {%n%n");

        generateSingleSpkKernelRecord(
                "SUN_FOR_2019_10_09",
                kernel, JplBody.Sun, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "EARTH_MOON_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "EARTH_FOR_2019_10_09",
                kernel, JplBody.Earth, JplBody.EarthMoonBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "MOON_FOR_2019_10_09",
                kernel, JplBody.Moon, JplBody.EarthMoonBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "VENUS_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.VenusBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "VENUS_FOR_2019_10_09",
                kernel, JplBody.Venus, JplBody.VenusBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "JUPITER_BARYCENTER_FOR_2019_10_09",
                kernel, JplBody.JupiterBarycenter, JplBody.SolarSystemBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        generateSingleSpkKernelRecord(
                "JUPITER_FOR_2019_10_09",
                kernel, JplBody.Jupiter, JplBody.JupiterBarycenter,
                JulianDay.fromDate(2019, 10, 9));

        System.out.println("}\n");
    }

    private static void generateSingleSpkKernelRecord(String spkRecordName, SpkKernelRepository kernel, JplBody target, JplBody observer, double jde) throws JplException {
        ChebyshevRecord record = kernel.getSpkKernelRecord(target, observer).getChebyshevRecords().stream()
                .filter(r -> r.getTimeSpan().inside(EphemerisSeconds.fromJde(jde)))
                .reduce((a, b) -> b)
                .orElseThrow();

        System.out.printf("\tpublic static SpkKernelRecord %s;%n%n", spkRecordName);
        System.out.println("\tstatic {");
        System.out.printf("\t\tTimeSpan timeSpan = new TimeSpan(%s, %s);%n",
                record.getTimeSpan().getFrom(), record.getTimeSpan().getTo());
        System.out.println("\t\tXYZCoefficients coefficients = new XYZCoefficients();");
        System.out.printf("\t\tcoefficients.x = new double[]{%s};%n\t\tcoefficients.y = new double[]{%s};%n\t\tcoefficients.z = new double[]{%s};%n",
                Arrays.stream(record.getCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.println("\n\t\tList<ChebyshevRecord> chebyshevRecords = Collections.singletonList(new ChebyshevRecord(timeSpan, coefficients));");
        System.out.printf("\t\t%s = new SpkKernelRecord(JplBody.%s, JplBody.%s, ReferenceFrame.J2000, chebyshevRecords);%n",
                spkRecordName,
                target, observer);
        System.out.println("\t}\n");
    }

}
