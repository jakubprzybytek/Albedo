package jp.albedo.webapp.ephemeris.admin.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;

public class KernelInfo {

    @JsonProperty
    private final String kernelFileName;

    @JsonProperty
    private final JplBody targetBody;

    @JsonProperty
    private final JplBody observerBody;

    @JsonProperty
    private final ReferenceFrame referenceFrame;

    @JsonProperty
    private final int positionChebyshevRecords;

    @JsonProperty
    private final int positionAndVelocityChebyshevRecords;

    public KernelInfo(String kernelFileName, JplBody targetBody, JplBody observerBody, ReferenceFrame referenceFrame, int positionChebyshevRecords, int positionAndVelocityChebyshevRecords) {
        this.kernelFileName = kernelFileName;
        this.targetBody = targetBody;
        this.observerBody = observerBody;
        this.referenceFrame = referenceFrame;
        this.positionChebyshevRecords = positionChebyshevRecords;
        this.positionAndVelocityChebyshevRecords = positionAndVelocityChebyshevRecords;
    }
}
