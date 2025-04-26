import { vi, describe, it, expect } from "vitest";
import { JplBodyId } from '../..';
import { DataType, PositionChebyshevRecord, SpkKernelCollection, SpkKernelRepository, TimeSpan } from "../../kernel";
import { CorrectionType, LightTimeCorrectingStateSolver, StateSolverBuilder } from "./";

const DUMMY_RECORD: PositionChebyshevRecord = { timeSpan: new TimeSpan(0, 1), positionCoefficients: { x: [], y: [], z: [] } };

const earthMoonSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.EarthMoonBarycenter, centerBodyId: JplBodyId.SolarSystemBarycenter, data: [DUMMY_RECORD], dataType: DataType.ChebyshevPosition };
const earthSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.Earth, centerBodyId: JplBodyId.EarthMoonBarycenter, data: [DUMMY_RECORD], dataType: DataType.ChebyshevPosition };
const moonSpk: SpkKernelCollection = { kernelFileName: '', bodyId: JplBodyId.Moon, centerBodyId: JplBodyId.EarthMoonBarycenter, data: [DUMMY_RECORD], dataType: DataType.ChebyshevPosition };

const spkKernelRepository = new SpkKernelRepository();
spkKernelRepository.registerSpkKernelCollections([
    earthMoonSpk,
    earthSpk,
    moonSpk
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

    it("should use CommonCenterBodyStateSolver when bodies revolves around common center body", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBodyId.Moon)
            .forObserver(JplBodyId.Earth);

        const buildCommonCenterBodyStateSolver = vi.spyOn(stateSolverBuilder, 'buildCommonCenterBodyStateSolver');

        stateSolverBuilder.build();

        expect(buildCommonCenterBodyStateSolver).toBeCalledTimes(1);
        expect(buildCommonCenterBodyStateSolver).toBeCalledWith([
            moonSpk,
        ], [
            earthSpk,
        ]);
    });

    it("should use LightTimeCorrectingStateSolver when Light Time correction is enabled", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBodyId.Moon)
            .forObserver(JplBodyId.Earth)
            .withCorrections(CorrectionType.LightTime);

        const buildLightTimeCorrectingStateSolver = vi.spyOn(stateSolverBuilder, 'buildLightTimeCorrectingStateSolver');

        stateSolverBuilder.build();

        expect(buildLightTimeCorrectingStateSolver).toBeCalledTimes(1);
        expect(buildLightTimeCorrectingStateSolver).toBeCalledWith([
            earthMoonSpk,
            moonSpk,
        ], [
            earthMoonSpk,
            earthSpk,
        ]);
    });

    it("should use StarAberrationCorrectingStateSolver when Light Time correction is enabled", () => {
        const stateSolverBuilder = new StateSolverBuilder(spkKernelRepository)
            .forTarget(JplBodyId.Moon)
            .forObserver(JplBodyId.Earth)
            .withCorrections(CorrectionType.LightTime, CorrectionType.StarAbberation);

        const buildStarAberrationCorrectingStateSolver = vi.spyOn(stateSolverBuilder, 'buildStarAberrationCorrectingStateSolver');

        stateSolverBuilder.build();

        expect(buildStarAberrationCorrectingStateSolver).toBeCalledTimes(1);
        expect(buildStarAberrationCorrectingStateSolver).toBeCalledWith(
            new LightTimeCorrectingStateSolver([earthMoonSpk, moonSpk], [earthMoonSpk, earthSpk]),
            [
                earthMoonSpk,
                earthSpk,
            ]);
    });
});
