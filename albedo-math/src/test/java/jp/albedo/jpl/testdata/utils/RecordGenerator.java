package jp.albedo.jpl.testdata.utils;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.kernel.TimeSpan;

import java.util.Arrays;
import java.util.stream.Collectors;

public class RecordGenerator {

    public static void generatePositionOnlyCollection(StringBuilder output, String spkRecordName, SpkKernelRepository kernel, JplBody target, JplBody observer, double jde) throws JplException {
        PositionChebyshevRecord record = kernel.getSpkKernelCollection(target, observer).getPositionData().stream()
                .filter(r -> r.getTimeSpan().inside(EphemerisSeconds.fromJde(jde)))
                .reduce((a, b) -> b)
                .orElseThrow();

        System.out.printf("%s w.r.t. %s, time span: [%s,%s]%n",
                target,
                observer,
                EphemerisSeconds.toJde(record.getTimeSpan().getFrom()),
                EphemerisSeconds.toJde(record.getTimeSpan().getTo()));

        output.append(String.format("\tpublic static SpkKernelCollection %s;\n\n", spkRecordName));
        output.append("\tstatic {\n");
        output.append(String.format("\t\tTimeSpan timeSpan = new TimeSpan(%s, %s);\n",
                record.getTimeSpan().getFrom(), record.getTimeSpan().getTo()));
        output.append("\t\tXYZCoefficients coefficients = new XYZCoefficients();\n");
        output.append(String.format("\t\tcoefficients.x = new double[]{%s};\n\t\tcoefficients.y = new double[]{%s};%n\t\tcoefficients.z = new double[]{%s};\n",
                Arrays.stream(record.getPositionCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                Arrays.stream(record.getPositionCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))));
        output.append("\n\t\tList<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));\n");
        output.append(String.format("\t\t%s = new SpkKernelCollection(JplBody.%s, JplBody.%s, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());\n",
                spkRecordName,
                target, observer));
        output.append("\t}\n\n");
    }

    public static void generatePositionAndVelocityCollection(StringBuilder output, String spkRecordName, SpkKernelRepository kernel, JplBody target, JplBody observer, TimeSpan period) throws JplException {
        output.append(String.format("\tpublic static SpkKernelCollection %s;\n\n", spkRecordName));
        output.append("\tstatic {\n");

        output.append("\n\t\tList<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords = new ArrayList<>();\n\n");

        kernel.getSpkKernelCollection(target, observer).getPositionAndVelocityData().stream()
                .filter(r -> r.getTimeSpan().overlaps(period))
                .forEach(record -> {
                    System.out.printf("%s w.r.t. %s, time span: [%s,%s]%n",
                            target,
                            observer,
                            EphemerisSeconds.toJde(record.getTimeSpan().getFrom()),
                            EphemerisSeconds.toJde(record.getTimeSpan().getTo()));

                    generatePositionAndVelocityRecord(output, record);
                });

        output.append(String.format("\t\t%s = new SpkKernelCollection(JplBody.%s, JplBody.%s, ReferenceFrame.J2000, Collections.emptyList(), positionAndVelocityChebyshevRecords);\n",
                spkRecordName,
                target, observer));
        output.append("\t}\n\n");
    }

    private static void generatePositionAndVelocityRecord(StringBuilder output, PositionAndVelocityChebyshevRecord record) {

        final String suffix = String.valueOf(record.getTimeSpan().getFrom()).replace('.', '_');

        output.append(String.format("\t\tTimeSpan timeSpan_%s = new TimeSpan(%s, %s);\n",
                suffix, record.getTimeSpan().getFrom(), record.getTimeSpan().getTo()));
        output.append(String.format("\t\tXYZCoefficients positionCoefficients_%s = new XYZCoefficients();\n", suffix));
        output.append(String.format("\t\tpositionCoefficients_%s.x = new double[]{%s};\n\t\tpositionCoefficients_%s.y = new double[]{%s};%n\t\tpositionCoefficients_%s.z = new double[]{%s};\n",
                suffix,
                Arrays.stream(record.getPositionCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                suffix,
                Arrays.stream(record.getPositionCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                suffix,
                Arrays.stream(record.getPositionCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))));
        output.append(String.format("\t\tXYZCoefficients velocityCoefficients_%s = new XYZCoefficients();\n", suffix));
        output.append(String.format("\t\tvelocityCoefficients_%s.x = new double[]{%s};\n\t\tvelocityCoefficients_%s.y = new double[]{%s};%n\t\tvelocityCoefficients_%s.z = new double[]{%s};\n",
                suffix,
                Arrays.stream(record.getVelocityCoefficients().x)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                suffix,
                Arrays.stream(record.getVelocityCoefficients().y)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", ")),
                suffix,
                Arrays.stream(record.getVelocityCoefficients().z)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.joining(", "))));

        output.append(String.format("\n\t\tpositionAndVelocityChebyshevRecords.add(new PositionAndVelocityChebyshevRecord(timeSpan_%s, positionCoefficients_%s, velocityCoefficients_%s));\n\n",
                suffix, suffix, suffix));
    }

}
