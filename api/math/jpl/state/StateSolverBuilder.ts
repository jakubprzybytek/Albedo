import { JplBody } from "../";
import { SpkKernelRepository, SpkKernelCollection } from "../kernel";
import { StateSolver, DirectStateSolver } from "./";

export class StateSolverBuilder {

    private readonly spkKernel: SpkKernelRepository;

    private targetBody?: JplBody;
    private observerBody?: JplBody;

    constructor(spkKernel: SpkKernelRepository) {
        this.spkKernel = spkKernel;
    }

    target(targetBody: JplBody): StateSolverBuilder {
        this.targetBody = targetBody;
        return this;
    }

    observer(observerBody: JplBody): StateSolverBuilder {
        this.observerBody = observerBody;
        return this;
    }

    build(): StateSolver {
        if (!this.targetBody || !this.observerBody) {
            throw Error('Both target body and observer body need to be defined.');
        }

        const spkForTarget = this.spkKernel.getAllTransientSpkKernelCollections(this.targetBody);

        // check if observer is on the path for target
        const observerIndex = spkForTarget
            .findIndex(spkKernelCollection => spkKernelCollection.centerBody === this.observerBody);

        if (observerIndex >= 0) {
            return this.buildDirectStateSolver(spkForTarget.slice(observerIndex));
        }

        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(this.observerBody);

        // check if target is on the spkRecords for observer
        const targetIndex = spkForObserver
            .findIndex(spkKernelCollection => spkKernelCollection.centerBody === this.targetBody);

        if (spkForObserver.length > 0) {
            return this.buildDirectStateSolver(spkForObserver.slice(targetIndex), true);
        }

        throw Error(`Cannot create state solver for '${this.targetBody}' w.r.t. '${this.observerBody}'`);
    }

    buildDirectStateSolver(spkKernelCollections: SpkKernelCollection[], negate: boolean = false) {
        return new DirectStateSolver(spkKernelCollections, negate)
    }

}