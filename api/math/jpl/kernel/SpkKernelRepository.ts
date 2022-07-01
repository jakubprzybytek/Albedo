import { SpkKernelCollection } from './';
import { JplBody } from '..';
import { Forest } from './tree';
import { StateSolverBuilder } from '../state';

export class SpkKernelRepository {

    readonly spkKernel: Forest<JplBody, SpkKernelCollection> = new Forest();

    registerSpkKernelCollection(newCollection: SpkKernelCollection) {
        console.log(`Registering SPK records for ${newCollection.body.id} w.r.t. ${newCollection.centerBody.id}`);

        const existingCollection = this.spkKernel.findEdge(newCollection.centerBody, newCollection.body);

        if (existingCollection) {
            throw Error(`SPK Kernel for ${newCollection.body} w.r.t. ${newCollection.centerBody} is already registered`);
        }

        this.spkKernel.addEdge(newCollection.centerBody, newCollection.body, newCollection);
    }

    registerSpkKernelCollections(newCollections: SpkKernelCollection[]) {
        newCollections.forEach(collection => this.registerSpkKernelCollection(collection));
    }

    stateSolverBuilder(): StateSolverBuilder {
        return new StateSolverBuilder(this);
    }

    getAllTransientSpkKernelCollections(target: JplBody): SpkKernelCollection[] {
        const spkKernelCollectionsToTarget = this.spkKernel.findEdgesTo(target);

        if (spkKernelCollectionsToTarget === undefined) {
            throw Error(`Cannot find SPK Kernel record data for target: ${target}`);
        }

        return spkKernelCollectionsToTarget;
    }

}
