import { vi, describe, it, expect } from "vitest";
import { JplBodyId } from "../";
import { PositionChebyshevRecord, SpkKernelCollection, SpkKernelRepository, TimeSpan } from "../kernel";
import { StateSolverBuilder } from "./";

const DUMMY_RECORD: PositionChebyshevRecord = { timeSpan: new TimeSpan(0, 1), positionCoefficients: { x: [], y: [], z: [] } };

const earthMoonSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.EarthMoonBarycenter, centerBodyId: JplBodyId.SolarSystemBarycenter, positionData: [DUMMY_RECORD] };
const earthSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.Earth, centerBodyId: JplBodyId.EarthMoonBarycenter, positionData: [DUMMY_RECORD] };

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
