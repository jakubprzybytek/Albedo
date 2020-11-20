package jp.albedo.jpl.files;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.kernel.SpkKernelRecord;

import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

public class Test {

    public static void main(String[] args) throws Exception {
        SpkKernelRepository kernel = new SpkKernelRepository();
        kernel.load(new File("d:/Workspace/Java/Albedo/misc/de438t.bsp"), JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25));
        kernel.load(new File("d:/Workspace/Java/Albedo/misc/jup357.bsp"), JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25));

        System.out.println("Solar System Barycenter -> Earth moon barycenter");
        printChebyshevData(
                kernel.getSpkKernelRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter),
                EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));

        System.out.println("Earth moon barycenter -> Earth");
        printChebyshevData(
                kernel.getSpkKernelRecord(JplBody.Earth, JplBody.EarthMoonBarycenter),
                EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 9)));
    }

    private static void printChebyshevData(SpkKernelRecord chebyshevData, double jde) {
        ChebyshevRecord record = chebyshevData.getChebyshevRecords().stream()
                .filter(r -> r.getTimeSpan().inside(jde))
                .reduce((a, b) -> b)
                .get();

        printRecordJavaStyle(record);
    }

    private static void printRecordJavaStyle(ChebyshevRecord record) {
        System.out.printf("new TimeSpan(%s, %s);%n", String.valueOf(record.getTimeSpan().getFrom()), String.valueOf(record.getTimeSpan().getTo()));
        System.out.printf("new double[]{%s};%n",
                Arrays.stream(record.getCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.printf("new double[]{%s};%n",
                Arrays.stream(record.getCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
        System.out.printf("new double[]{%s};%n",
                Arrays.stream(record.getCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))
        );
    }

}
