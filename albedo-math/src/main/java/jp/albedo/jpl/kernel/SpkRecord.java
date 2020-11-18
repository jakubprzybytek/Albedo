package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;

import java.util.Comparator;
import java.util.List;

public class SpkRecord {

    private final JplBody body;

    private final JplBody centerBody;

    private final ReferenceFrame referenceFrame;

    private final List<ChebyshevRecord> chebyshevRecords;

    public SpkRecord(JplBody body, JplBody centerBody, ReferenceFrame referenceFrame, List<ChebyshevRecord> chebyshevRecords) {
        this.body = body;
        this.centerBody = centerBody;
        this.referenceFrame = referenceFrame;
        this.chebyshevRecords = chebyshevRecords;
    }

    public static SpkRecord fromArrayInformation(SpkFileArrayInformation arrayInfo, List<ChebyshevRecord> chebyshevRecords) {
        return new SpkRecord(arrayInfo.getBody(), arrayInfo.getCenterBody(), arrayInfo.getReferenceFrame(), chebyshevRecords);
    }

    public JplBody getBody() {
        return body;
    }

    public JplBody getCenterBody() {
        return centerBody;
    }

    public ReferenceFrame getReferenceFrame() {
        return referenceFrame;
    }

    public List<ChebyshevRecord> getChebyshevRecords() {
        return chebyshevRecords;
    }

    public void merge(SpkRecord newData) {
        if (body != newData.body || centerBody != newData.centerBody || referenceFrame != newData.referenceFrame) {
            throw new IllegalArgumentException("Cannot merge data for different bodies or/and reference frame!");
        }

        chebyshevRecords.addAll(newData.getChebyshevRecords());
        chebyshevRecords.sort(Comparator.comparingDouble(record -> record.getTimeSpan().getTo()));
    }
}
