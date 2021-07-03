package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.files.binary.SpkFileArrayInformation;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class SpkKernelCollection {

    private final JplBody body;

    private final JplBody centerBody;

    private final ReferenceFrame referenceFrame;

    private final List<PositionChebyshevRecord> positionData;

    private final List<PositionAndVelocityChebyshevRecord> positionAndVelocityData;

    public SpkKernelCollection(JplBody body, JplBody centerBody, ReferenceFrame referenceFrame,
                               List<PositionChebyshevRecord> positionData,
                               List<PositionAndVelocityChebyshevRecord> positionAndVelocityData) {
        this.body = body;
        this.centerBody = centerBody;
        this.referenceFrame = referenceFrame;
        this.positionData = positionData;
        this.positionAndVelocityData = positionAndVelocityData;
    }

    public static SpkKernelCollection fromArrayInformationAndPosition(SpkFileArrayInformation arrayInfo, List<PositionChebyshevRecord> data) {
        return new SpkKernelCollection(arrayInfo.getBody(), arrayInfo.getCenterBody(), arrayInfo.getReferenceFrame(), data, new ArrayList<>());
    }

    public static SpkKernelCollection fromArrayInformationAndPositionAndVelocity(SpkFileArrayInformation arrayInfo, List<PositionAndVelocityChebyshevRecord> data) {
        return new SpkKernelCollection(arrayInfo.getBody(), arrayInfo.getCenterBody(), arrayInfo.getReferenceFrame(), new ArrayList<>(), data);
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

    public List<PositionChebyshevRecord> getPositionData() {
        return positionData;
    }

    public boolean hasPositionAndVelocityData() {
        return !positionAndVelocityData.isEmpty();
    }

    public List<PositionAndVelocityChebyshevRecord> getPositionAndVelocityData() {
        return positionAndVelocityData;
    }

    public void merge(SpkKernelCollection moreData) {
        if (body != moreData.body || centerBody != moreData.centerBody || referenceFrame != moreData.referenceFrame) {
            throw new IllegalArgumentException("Cannot merge data for different bodies or/and reference frame!");
        }

        if (!moreData.getPositionData().isEmpty()) {
            positionData.addAll(moreData.getPositionData());
            positionData.sort(Comparator.comparingDouble(record -> record.getTimeSpan().getTo()));
        }

        if (!moreData.getPositionAndVelocityData().isEmpty()) {
            positionAndVelocityData.addAll(moreData.getPositionAndVelocityData());
            positionAndVelocityData.sort(Comparator.comparingDouble(record -> record.getTimeSpan().getTo()));
        }
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
        SpkKernelCollection rhs = (SpkKernelCollection) obj;
        return new EqualsBuilder()
                .appendSuper(super.equals(obj))
                .append(body, rhs.body)
                .append(centerBody, rhs.centerBody)
                .append(referenceFrame, rhs.referenceFrame)
                .isEquals();
    }
}
