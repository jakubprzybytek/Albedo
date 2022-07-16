import { JplBodyId } from '../..';
import { SpkKernelRepository, SpkKernelCollection } from '../../kernel';
import { StateSolver, DirectStateSolver, CommonCenterBodyStateSolver } from './';

export class StateSolverBuilder {

    private readonly spkKernel: SpkKernelRepository;

    private targetBody?: JplBodyId;
    private observerBody?: JplBodyId;

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

    build(): StateSolver {
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

    buildDirectStateSolver(spkKernelCollections: SpkKernelCollection[], negate: boolean = false) {
        return new DirectStateSolver(spkKernelCollections, negate)
    }

    buildCommonCenterBodyStateSolver(spkKernelCollectionsForTarget: SpkKernelCollection[], spkKernelCollectionsForObserver: SpkKernelCollection[]) {
        return new CommonCenterBodyStateSolver(spkKernelCollectionsForTarget, spkKernelCollectionsForObserver);
    }
}