import { JplBodyId } from '../..';
import { SpkKernelRepository, SpkKernelCollection } from '../../kernel';
import { StateSolver, DirectStateSolver, CommonCenterBodyStateSolver, LightTimeCorrectingStateSolver, CorrectionType } from './';

export class StateSolverBuilder {

    private readonly spkKernel: SpkKernelRepository;

    private targetBody?: JplBodyId;
    private observerBody?: JplBodyId;
    private corrections?: CorrectionType[];

    constructor(spkKernel: SpkKernelRepository) {
        this.spkKernel = spkKernel;
    }

    forTarget(targetBody: JplBodyId): StateSolverBuilder {
        this.targetBody = targetBody;
        return this;
    }

    forObserver(observerBody: JplBodyId): StateSolverBuilder {
        this.observerBody = observerBody;
        return this;
    }

    withCorrections(...corrections: CorrectionType[]): StateSolverBuilder {
        this.corrections = corrections;
        return this;
    }

    build(): StateSolver {
        if (this.corrections === undefined || this.corrections.length === 0) {
            return this.buildUncorrected();
        } else {
            return this.buildCorrected(this.corrections);
        }
    }

    buildUncorrected(): StateSolver {
        if (this.targetBody === undefined || this.observerBody === undefined) {
            throw Error('Both target body and observer body need to be defined.');
        }

        const spkForTarget = this.spkKernel.getAllTransientSpkKernelCollections(this.targetBody);

        // check if observer is on the path for target
        const observerIndex = spkForTarget
            .findIndex(spkKernelCollection => spkKernelCollection.centerBodyId === this.observerBody);

        if (observerIndex >= 0) {
            return this.buildDirectStateSolver(spkForTarget.slice(observerIndex));
        }

        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(this.observerBody);

        // check if target is on the spkRecords for observer
        const targetIndex = spkForObserver
            .findIndex(spkKernelCollection => spkKernelCollection.centerBodyId === this.targetBody);

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

        throw Error(`Cannot create state solver for '${this.targetBody}' w.r.t. '${this.observerBody}'`);
    }

    buildCorrected(corrections: CorrectionType[]): StateSolver {
        if (this.targetBody === undefined || this.observerBody === undefined) {
            throw Error('Both target body and observer body need to be defined.');
        }

        const spkForTarget = this.spkKernel.getAllTransientSpkKernelCollections(this.targetBody);
        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(this.observerBody);

        if (spkForTarget[0].centerBodyId != spkForObserver[0].centerBodyId) {
            throw Error("Cannot set up state solver for bodies that don't have the same ancestor in SPK kernel.");
        }

        if (corrections.includes(CorrectionType.LightTime)) {
            return new LightTimeCorrectingStateSolver(spkForTarget, spkForObserver);
        }

        throw Error("Cannot set up state solver for corrections: " + corrections);
    }

    buildDirectStateSolver(spkKernelCollections: SpkKernelCollection[], negate: boolean = false) {
        return new DirectStateSolver(spkKernelCollections, negate)
    }

    buildCommonCenterBodyStateSolver(spkKernelCollectionsForTarget: SpkKernelCollection[], spkKernelCollectionsForObserver: SpkKernelCollection[]) {
        return new CommonCenterBodyStateSolver(spkKernelCollectionsForTarget, spkKernelCollectionsForObserver);
    }
}