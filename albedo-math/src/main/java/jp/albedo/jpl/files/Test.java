package jp.albedo.jpl.files;

import jp.albedo.common.JulianDay;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.binary.SpkFileReader;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.KernelRepository;

import java.io.File;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Test {

    public static void main(String args[]) throws Exception {

        //load("d:/Workspace/Java/Albedo/misc/de438t.bsp");
        //load("d:/Workspace/Java/Albedo/misc/jup357.bsp");

//        SpkFileLoader loader = new SpkFileLoader(new File("d:/Workspace/Java/Albedo/misc/de438t.bsp"));
//        loader.loadAll(JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25)).forEach(data ->
//                System.out.printf("Body: %s(%d), center body: %s(%d), frame: %s, records: %d%n",
//                        data.getBody(), data.getBody().id, data.getCenterBody(), data.getCenterBody().id,
//                        data.getReferenceFrame(), data.getChebyshevRecords().size())
//        );

        KernelRepository kernel = new KernelRepository();
        kernel.load(new File("d:/Workspace/Java/Albedo/misc/de438t.bsp"), JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25));
        kernel.load(new File("d:/Workspace/Java/Albedo/misc/jup357.bsp"), JulianDay.fromDate(1950, 12, 31), JulianDay.fromDate(2100, 1, 25));
    }

    private static void load(String fileName) throws IOException, JplException {
        System.out.println("Before: " + (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / (1024.0 * 1024.0));
        final Instant start = Instant.now();

        Map<JplBody, List<ChebyshevRecord>> kernel = new HashMap<>();

        try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(new File(fileName).toPath(), StandardOpenOption.READ)) {

            SpkFileReader reader = new SpkFileReader(fileChannel);
            reader.getArraysInformation()
                    .forEach(arrayInfo -> {
                        System.out.printf("Body: %s(%d), center body: %s(%d), from: %.1f, to: %.1f, frame: %s, type: %s, first index: %d, last: %d, numbers: %d%n",
                                arrayInfo.getBody(), arrayInfo.getBody().id, arrayInfo.getCenterBody(), arrayInfo.getCenterBody().id,
                                arrayInfo.getStartDate(), arrayInfo.getEndDate(), arrayInfo.getReferenceFrame(), arrayInfo.getDataType(),
                                arrayInfo.getStartIndex(), arrayInfo.getEndIndex(), arrayInfo.getEndIndex() - arrayInfo.getStartIndex() + 1);
                        try {
                            List<ChebyshevRecord> chebyshevRecords = reader.getEntireChebyshevArray(arrayInfo,
                                    EphemerisSeconds.fromJde(JulianDay.fromDate(1950, 12, 31)),
                                    EphemerisSeconds.fromJde(JulianDay.fromDate(2100, 1, 25)));
                            System.out.printf("Got %d record(s).%n", chebyshevRecords.size());
                            kernel.put(arrayInfo.getBody(), chebyshevRecords);
                        } catch (JplException e) {
                            e.printStackTrace();
                        }
                    });
        }

        System.out.println("After: " + (Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()) / (1024.0 * 1024.0) + " time: " + Duration.between(start, Instant.now()));
        System.out.println("Loaded records " + kernel.values().stream().map(List::size).reduce(0, Integer::sum));
    }

}
