import { SpkKernelCollection } from './';
import { EphemerisSeconds, JplBodyId, jplBodyFromId } from '..';
import { Forest } from './tree';
import { StateSolverBuilder } from '../state/solvers';
import { StateSolver2 } from '@jpl/state/solver2/StateSolver';
import { JulianDay } from '@astro';

export class SpkKernelRepository {

    readonly spkKernel: Forest<JplBodyId, SpkKernelCollection> = new Forest();

    registerSpkKernelCollection(newCollection: SpkKernelCollection) {
        const body = jplBodyFromId(newCollection.bodyId);
        const centerBody = jplBodyFromId(newCollection.centerBodyId);

        const fromJde = EphemerisSeconds.toJde(newCollection.data[0].timeSpan.from);
        const toJde = EphemerisSeconds.toJde(newCollection.data[newCollection.data.length - 1].timeSpan.to);

        const fromTde = JulianDay.toDateTime(fromJde).toISOString();
        const toTde = JulianDay.toDateTime(toJde).toISOString();

        const recordWidth = EphemerisSeconds.toDays(newCollection.data[0].timeSpan.to - newCollection.data[0].timeSpan.from);

        console.log(`SPK registered for '${body?.name}(${body?.id})' w.r.t. '${centerBody?.name}(${centerBody?.id})' for ${fromTde}(${fromJde}) - ${toTde}(${toJde}) / ${recordWidth} days per record. Datr type: ${newCollection.dataType}.`);

        const existingCollection = this.spkKernel.findEdge(newCollection.centerBodyId, newCollection.bodyId);

        if (existingCollection) {
            throw Error(`SPK Kernel for '${body?.name}(${body?.id})' w.r.t. '${centerBody?.name}(${centerBody?.id})' is already registered. Merging not implemented yet!`);
        }

        this.spkKernel.addEdge(newCollection.centerBodyId, newCollection.bodyId, newCollection);
    }

    registerSpkKernelCollections(newCollections: SpkKernelCollection[]) {
        newCollections.forEach(collection => this.registerSpkKernelCollection(collection));
    }

    stateSolverBuilder(): StateSolverBuilder {
        return new StateSolverBuilder(this);
    }

    stateSolver2(): StateSolver2 {
        return new StateSolver2(this.spkKernel);
    }

    getAllTransientSpkKernelCollections(target: JplBodyId): SpkKernelCollection[] {
        const spkKernelCollectionsToTarget = this.spkKernel.findEdgesTo(target);

        if (spkKernelCollectionsToTarget === undefined) {
            throw Error(`Cannot find SPK Kernel record data for target: ${target}`);
        }

        return spkKernelCollectionsToTarget;
    }

}
