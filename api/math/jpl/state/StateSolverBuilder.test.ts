import { vi, describe, it, expect } from "vitest";
import { JplBodyId } from "../";
import { SpkKernelCollection, SpkKernelRepository } from "../kernel";
import { StateSolverBuilder } from "./";

const earthMoonSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.EarthMoonBarycenter, centerBodyId: JplBodyId.SolarSystemBarycenter, positionData: [] };
const earthSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.Earth, centerBodyId: JplBodyId.EarthMoonBarycenter, positionData: [] };

const spkKernelRepository = new SpkKernelRepository();
spkKernelRepository.registerSpkKernelCollections([
    earthMoonSpk,
    earthSpk
]);

describe("StateSolverBuilder", () => {

    it("should use DirectStateSolver when bodies are in close relation to each other", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBodyId.Earth)
            .forObserver(JplBodyId.SolarSystemBarycenter);

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
            .forTarget(JplBodyId.EarthMoonBarycenter)
            .forObserver(JplBodyId.Earth);

        const buildDirectStateSolver = vi.spyOn(stateSolverBuilder, 'buildDirectStateSolver');

        stateSolverBuilder.build();

        expect(buildDirectStateSolver).toBeCalledTimes(1);
        expect(buildDirectStateSolver).toBeCalledWith([
            earthSpk,
        ], true);
    });

});
