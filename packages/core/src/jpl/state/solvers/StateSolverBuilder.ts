import { JplBodyId } from '../..';
import { SpkKernelRepository, SpkKernelCollection } from '../../kernel';
import { StateSolver, DirectStateSolver, CommonCenterBodyStateSolver, LightTimeCorrectingStateSolver, CorrectionType, StarAberrationCorrectingStateSolver } from './';

export class StateSolverBuilder {

    private readonly spkKernel: SpkKernelRepository;

    private targetBodyId?: JplBodyId;
    private observerBodyId?: JplBodyId;
    private corrections?: CorrectionType[];

    constructor(spkKernel: SpkKernelRepository) {
        this.spkKernel = spkKernel;
    }

    forTarget(targetBody: JplBodyId): StateSolverBuilder {
        this.targetBodyId = targetBody;
        return this;
    }

    forObserver(observerBody: JplBodyId): StateSolverBuilder {
        this.observerBodyId = observerBody;
        return this;
    }

    withCorrections(...corrections: CorrectionType[]): StateSolverBuilder {
        this.corrections = corrections;
        return this;
    }

    build(): StateSolver {
        if (this.targetBodyId === undefined || this.observerBodyId === undefined) {
            throw Error('Both target body and observer body need to be defined.');
        }

        if (this.corrections === undefined || this.corrections.length === 0) {
            return this.buildUncorrected(this.targetBodyId, this.observerBodyId);
        } else {
            return this.buildCorrected(this.targetBodyId, this.observerBodyId, this.corrections);
        }
    }

    buildUncorrected(targetBodyId: JplBodyId, observerBodyId: JplBodyId): StateSolver {
        const spkForTarget = this.spkKernel.getAllTransientSpkKernelCollections(targetBodyId);

        // check if observer is on the path for target
        const observerIndex = spkForTarget
            .findIndex(spkKernelCollection => spkKernelCollection.centerBodyId === this.observerBodyId);

        if (observerIndex >= 0) {
            return this.buildDirectStateSolver(spkForTarget.slice(observerIndex));
        }

        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(observerBodyId);

        // check if target is on the spkRecords for observer
        const targetIndex = spkForObserver
            .findIndex(spkKernelCollection => spkKernelCollection.centerBodyId === this.targetBodyId);

        if (targetIndex >= 0) {
            return this.buildDirectStateSolver(spkForObserver.slice(targetIndex), true);
        }

        // try to find smallest subtree with common root node
        var commonIndex = 0;
        while (spkForTarget[commonIndex].bodyId === spkForObserver[commonIndex].bodyId &&
            spkForTarget[commonIndex].centerBodyId === spkForObserver[commonIndex].centerBodyId) {
            commonIndex++;
        }

        if (spkForTarget[commonIndex].centerBodyId === spkForObserver[commonIndex].centerBodyId) {
            return this.buildCommonCenterBodyStateSolver(spkForTarget.slice(commonIndex), spkForObserver.slice(commonIndex));
        }

        throw Error(`Cannot create state solver for '${this.targetBodyId}' w.r.t. '${this.observerBodyId}'`);
    }

    buildCorrected(targetBodyId: JplBodyId, observerBodyId: JplBodyId, corrections: CorrectionType[]): StateSolver {
        if (this.targetBodyId === undefined || this.observerBodyId === undefined) {
            throw Error('Both target body and observer body need to be defined.');
        }

        const spkForTarget = this.spkKernel.getAllTransientSpkKernelCollections(this.targetBodyId);
        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(this.observerBodyId);

        if (spkForTarget[0].centerBodyId != spkForObserver[0].centerBodyId) {
            throw Error("Cannot set up state solver for bodies that don't have the same ancestor in SPK kernel.");
        }

        if (corrections.includes(CorrectionType.LightTime) && corrections.includes(CorrectionType.StarAbberation)) {
            const stateSolverForTarget = new LightTimeCorrectingStateSolver(spkForTarget, spkForObserver);
            return this.buildStarAberrationCorrectingStateSolver(stateSolverForTarget, spkForObserver);
        }

        if (corrections.includes(CorrectionType.LightTime)) {
            return this.buildLightTimeCorrectingStateSolver(spkForTarget, spkForObserver);
        }

        throw Error("Cannot set up state solver for corrections: " + corrections);
    }

    buildDirectStateSolver(spkForTarget: SpkKernelCollection[], negate: boolean = false) {
        return new DirectStateSolver(spkForTarget, negate)
    }

    buildCommonCenterBodyStateSolver(spkForTarget: SpkKernelCollection[], spkForObserver: SpkKernelCollection[]) {
        return new CommonCenterBodyStateSolver(spkForTarget, spkForObserver);
    }

    buildLightTimeCorrectingStateSolver(spkForTarget: SpkKernelCollection[], spkForObserver: SpkKernelCollection[]) {
        return new LightTimeCorrectingStateSolver(spkForTarget, spkForObserver);
    }

    buildStarAberrationCorrectingStateSolver(stateSolverForTarget: StateSolver, spkForObserver: SpkKernelCollection[]) {
        return new StarAberrationCorrectingStateSolver(stateSolverForTarget, spkForObserver);
    }
}