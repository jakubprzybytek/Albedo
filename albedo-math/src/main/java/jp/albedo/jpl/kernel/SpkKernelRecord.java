package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.Comparator;
import java.util.List;

public class SpkKernelRecord {

    private final JplBody body;

    private final JplBody centerBody;

    private final ReferenceFrame referenceFrame;

    private final List<ChebyshevRecord> chebyshevRecords;

    public SpkKernelRecord(JplBody body, JplBody centerBody, ReferenceFrame referenceFrame, List<ChebyshevRecord> chebyshevRecords) {
        this.body = body;
        this.centerBody = centerBody;
        this.referenceFrame = referenceFrame;
        this.chebyshevRecords = chebyshevRecords;
    }

    public static SpkKernelRecord fromArrayInformation(SpkFileArrayInformation arrayInfo, List<ChebyshevRecord> chebyshevRecords) {
        return new SpkKernelRecord(arrayInfo.getBody(), arrayInfo.getCenterBody(), arrayInfo.getReferenceFrame(), chebyshevRecords);
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

    public void merge(SpkKernelRecord newData) {
        if (body != newData.body || centerBody != newData.centerBody || referenceFrame != newData.referenceFrame) {
            throw new IllegalArgumentException("Cannot merge data for different bodies or/and reference frame!");
        }

        chebyshevRecords.addAll(newData.getChebyshevRecords());
        chebyshevRecords.sort(Comparator.comparingDouble(record -> record.getTimeSpan().getTo()));
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(35, 67).
                append(body).
                append(centerBody).
                append(referenceFrame).
                toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (obj.getClass() != getClass()) {
            return false;
        }
        SpkKernelRecord rhs = (SpkKernelRecord) obj;
        return new EqualsBuilder()
                .appendSuper(super.equals(obj))
                .append(body, rhs.body)
                .append(centerBody, rhs.centerBody)
                .append(referenceFrame, rhs.referenceFrame)
                .isEquals();
    }
}
