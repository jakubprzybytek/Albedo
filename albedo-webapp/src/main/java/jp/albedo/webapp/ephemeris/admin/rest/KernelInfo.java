package jp.albedo.webapp.ephemeris.admin.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;

import java.time.LocalDateTime;

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
    private final LocalDateTime positionChebyshevRecordsStartDate;

    @JsonProperty
    private final LocalDateTime positionChebyshevRecordsEndDate;

    @JsonProperty
    private final int positionAndVelocityChebyshevRecords;

    @JsonProperty
    private final LocalDateTime positionndVelocityChebyshevRecordsStartDate;

    @JsonProperty
    private final LocalDateTime positionndVelocityChebyshevRecordsEndDate;

    public KernelInfo(String kernelFileName, JplBody targetBody, JplBody observerBody, ReferenceFrame referenceFrame, int positionChebyshevRecords, LocalDateTime positionChebyshevRecordsStartDate, LocalDateTime positionChebyshevRecordsEndDate, int positionAndVelocityChebyshevRecords, LocalDateTime positionndVelocityChebyshevRecordsStartDate, LocalDateTime positionndVelocityChebyshevRecordsEndDate) {
        this.kernelFileName = kernelFileName;
        this.targetBody = targetBody;
        this.observerBody = observerBody;
        this.referenceFrame = referenceFrame;
        this.positionChebyshevRecords = positionChebyshevRecords;
        this.positionChebyshevRecordsStartDate = positionChebyshevRecordsStartDate;
        this.positionChebyshevRecordsEndDate = positionChebyshevRecordsEndDate;
        this.positionAndVelocityChebyshevRecords = positionAndVelocityChebyshevRecords;
        this.positionndVelocityChebyshevRecordsStartDate = positionndVelocityChebyshevRecordsStartDate;
        this.positionndVelocityChebyshevRecordsEndDate = positionndVelocityChebyshevRecordsEndDate;
    }
}
