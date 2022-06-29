import { vi, describe, it, expect } from "vitest";
import { JplBody } from "../";
import { SpkKernelCollection, SpkKernelRepository } from "../kernel";
import { StateSolverBuilder } from "./";

const earthMoonSpk: SpkKernelCollection = { kernelFileName: '', body: JplBody.EarthMoonBarycenter, centerBody: JplBody.SolarSystemBarycenter, positionData: [] };
const earthSpk: SpkKernelCollection = { kernelFileName: '', body: JplBody.Earth, centerBody: JplBody.EarthMoonBarycenter, positionData: [] };

const spkKernelRepository = new SpkKernelRepository();
spkKernelRepository.registerSpkKernelCollections([
    earthMoonSpk,
    earthSpk
]);

describe("StateSolverBuilder", () => {

    it("should use DirectStateSolver when bodies are in close relation to each other", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBody.Earth)
            .forObserver(JplBody.SolarSystemBarycenter);

        const buildDirectStateSolver = vi.spyOn(stateSolverBuilder, 'buildDirectStateSolver');

        stateSolverBuilder.build();

        expect(buildDirectStateSolver).toBeCalledTimes(1);
        expect(buildDirectStateSolver).toBeCalledWith([
            earthMoonSpk,
            earthSpk,
        ]);
    });

    it("should use DirectStateSolver when bodies are in close relation to each other in opposite direction that in kernel configuration", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBody.EarthMoonBarycenter)
            .forObserver(JplBody.Earth);

        const buildDirectStateSolver = vi.spyOn(stateSolverBuilder, 'buildDirectStateSolver');

        stateSolverBuilder.build();

        expect(buildDirectStateSolver).toBeCalledTimes(1);
        expect(buildDirectStateSolver).toBeCalledWith([
            earthSpk,
        ], true);
    });

});
