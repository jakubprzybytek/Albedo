import { JulianDay } from '@astro';
import { EphemerisSeconds, JplBodyId, jplBodyFromId } from '@jpl';
import { StateSolver } from '@jpl/state';
import { SpkKernelCollection } from '.';

export class SpkKernelRepository {

  readonly spkKernels = new Map<JplBodyId, SpkKernelCollection>;

  registerSpkKernelCollection(newCollection: SpkKernelCollection) {
    const body = jplBodyFromId(newCollection.bodyId);
    const centerBody = jplBodyFromId(newCollection.centerBodyId);

    const fromJde = EphemerisSeconds.toJde(newCollection.data[0].timeSpan.from);
    const toJde = EphemerisSeconds.toJde(newCollection.data[newCollection.data.length - 1].timeSpan.to);

    const fromTde = JulianDay.toDateTime(fromJde).toISOString();
    const toTde = JulianDay.toDateTime(toJde).toISOString();

    const recordWidth = EphemerisSeconds.toDays(newCollection.data[0].timeSpan.to - newCollection.data[0].timeSpan.from);

    console.log(`SPK registered for '${body?.name}(${body?.id})' w.r.t. '${centerBody?.name}(${centerBody?.id})' for ${fromTde}(${fromJde}) - ${toTde}(${toJde}) / ${recordWidth} days per record. Datr type: ${newCollection.dataType}.`);

    if (this.spkKernels.has(newCollection.bodyId)) {
      throw Error(`SPK Kernel for '${body?.name}(${body?.id})' w.r.t. '${centerBody?.name}(${centerBody?.id})' is already registered. Merging not implemented yet!`);
    }

    this.spkKernels.set(newCollection.bodyId, newCollection);
  }

  registerSpkKernelCollections(newCollections: SpkKernelCollection[]) {
    newCollections.forEach(collection => this.registerSpkKernelCollection(collection));
  }

  StateSolver(): StateSolver {
    return new StateSolver([...this.spkKernels.values()]);
  }

}
