package jp.albedo.webapp.system.rest;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SystemInformation {

    @JsonProperty
    private final int availableProcessors;

    @JsonProperty
    private final long maxMemory;

    @JsonProperty
    private final long allocatedMemory;

    @JsonProperty
    private final long freeMemory;

    public SystemInformation(int availableProcessors, long maxMemory, long allocatedMemory, long freeMemory) {
        this.availableProcessors = availableProcessors;
        this.maxMemory = maxMemory;
        this.allocatedMemory = allocatedMemory;
        this.freeMemory = freeMemory;
    }
}
