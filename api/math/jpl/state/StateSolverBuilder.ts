import { JplBody, SpkKernelRepository } from "../";
import { StateSolver, DirectStateSolver } from "./";

export class StateSolverBuilder {

    readonly spkKernel: SpkKernelRepository;

    targetBody?: JplBody;
    observerBody?: JplBody;

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
        while (spkForTarget.length > 0 && spkForTarget[0].centerBody !== this.observerBody) {
            spkForTarget.unshift();
        }

        if (spkForTarget.length > 0) {
            return new DirectStateSolver(spkForTarget);
        }

        const spkForObserver = this.spkKernel.getAllTransientSpkKernelCollections(this.observerBody);

        // check if target is on the spkRecords for observer
        while (spkForObserver.length > 0 && spkForObserver[0].centerBody !== this.targetBody) {
            spkForObserver.unshift();
        }

        if (spkForObserver.length > 0) {
            return new DirectStateSolver(spkForObserver, true);
        }

        throw Error(`Cannot create state solver for '${this.targetBody}' w.r.t. '${this.observerBody}'`);
    }

}