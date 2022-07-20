import { SpkKernelCollection } from './';
import { JplBodyId, jplBodyFromId } from '..';
import { Forest } from './tree';
import { StateSolverBuilder } from '../state/solvers';

export class SpkKernelRepository {

    readonly spkKernel: Forest<JplBodyId, SpkKernelCollection> = new Forest();

    registerSpkKernelCollection(newCollection: SpkKernelCollection) {
        const body = jplBodyFromId(newCollection.bodyId);
        const centerBody = jplBodyFromId(newCollection.centerBodyId);

        const fromJde = newCollection.data[0].timeSpan.from;
        const toJde = newCollection.data[newCollection.data.length - 1].timeSpan.to;

        console.log(`Registering SPK records for '${body?.name}' w.r.t. '${centerBody?.name}' for time span between ${fromJde} and ${toJde}`);

        const existingCollection = this.spkKernel.findEdge(newCollection.centerBodyId, newCollection.bodyId);

        if (existingCollection) {
            throw Error(`SPK Kernel for '${body?.name}' w.r.t. '${centerBody?.name}' is already registered. Merging not implemented yet!`);
        }

        this.spkKernel.addEdge(newCollection.centerBodyId, newCollection.bodyId, newCollection);
    }

    registerSpkKernelCollections(newCollections: SpkKernelCollection[]) {
        newCollections.forEach(collection => this.registerSpkKernelCollection(collection));
    }

    stateSolverBuilder(): StateSolverBuilder {
        return new StateSolverBuilder(this);
    }

    getAllTransientSpkKernelCollections(target: JplBodyId): SpkKernelCollection[] {
        const spkKernelCollectionsToTarget = this.spkKernel.findEdgesTo(target);

        if (spkKernelCollectionsToTarget === undefined) {
            throw Error(`Cannot find SPK Kernel record data for target: ${target}`);
        }

        return spkKernelCollectionsToTarget;
    }

}
