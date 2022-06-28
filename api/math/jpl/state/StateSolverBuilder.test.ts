import { vi, describe, it, beforeAll, expect } from "vitest";
import { JplBody } from "../";
import { SpkKernelRepository } from "../kernel";
import { StateSolverBuilder, DirectStateSolver } from "./";

const spkKernelRepository = new SpkKernelRepository();
spkKernelRepository.registerSpkKernelCollections([
    { kernelFileName: '', body: JplBody.EarthMoonBarycenter, centerBody: JplBody.SolarSystemBarycenter, positionData: [] },
    { kernelFileName: '', body: JplBody.Earth, centerBody: JplBody.EarthMoonBarycenter, positionData: [] }
]);

describe("StateSolverBuilder", () => {

    it("should use DirectStateSolver when bodies are in close relation to each other", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository);
        stateSolverBuilder.target(JplBody.Earth);
        stateSolverBuilder.observer(JplBody.SolarSystemBarycenter);
        
        const stateSolver = stateSolverBuilder.build();

        expect(stateSolver).toBeInstanceOf(DirectStateSolver);

        const directStateSolcer = stateSolver as DirectStateSolver;

        expect(directStateSolcer.negate).toBeFalsy();
        expect(directStateSolcer.calculators).toHaveLength(2);
    });

    it("should use DirectStateSolver when bodies are in close relation to each other in opposite direction that in kernel configuration", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository);
        stateSolverBuilder.target(JplBody.EarthMoonBarycenter);
        stateSolverBuilder.observer(JplBody.Earth);
        
        const stateSolver = stateSolverBuilder.build();

        expect(stateSolver).toBeInstanceOf(DirectStateSolver);

        const directStateSolcer = stateSolver as DirectStateSolver;

        expect(directStateSolcer.negate).toBeTruthy();
        expect(directStateSolcer.calculators).toHaveLength(1);
    });

});
