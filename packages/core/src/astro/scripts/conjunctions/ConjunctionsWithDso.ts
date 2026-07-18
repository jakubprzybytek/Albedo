import { AstronomicalCoordinates, ObserverLocation, Radians } from "@astro/coords";
import { DsoConjunction, Ephemerides, esOrder, timeProperties, separationFactor } from "@astro/scripts";
import { JplBodyId, jplBodyFromId, EphemerisSeconds } from "@jpl";
import { KernelsRepository } from "@jpl/kernels";
import { OpenNgcObject } from "@openNgc";
import { Table } from "@utils/Table";
import { findConjuctionCandidates, prepareCatalogueClusters } from "./dso/Catalogue";
import { findLocalMinimumByGoldenSection, findSampledLocalExtremums } from "@astro/math";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const DETAILED_INTERVAL = EphemerisSeconds.fromDays(1 / 12);

const SEPARATION_THRESHOLD = Radians.fromDegrees(0.5);

const SEPARATION_FACTOR_THRESHOLD = 5;

export type CoordinatesInTime = {
  es: number;
  coords: AstronomicalCoordinates;
}

export type ConjunctionPredictionRange = {
  bodyId: JplBodyId;
  dso: OpenNgcObject;
  toEs: number;
  fromEs: number;
}

function getAverageAngularSize(dso: OpenNgcObject): number | undefined {
  return dso.majorAxis ? dso.minorAxis ? (dso.majorAxis + dso.minorAxis) / 2 : dso.majorAxis : undefined;
}

export class ConjunctionsWithDso {

  readonly ephemerides: Ephemerides;

  readonly catalogueClusters: Table<OpenNgcObject[]>;

  constructor(kernels: KernelsRepository, dsoObjects: OpenNgcObject[]) {
    this.ephemerides = new Ephemerides(kernels);
    this.catalogueClusters = prepareCatalogueClusters(dsoObjects);
  }

  private buildSeparationFunction(bodyId: JplBodyId, dsoObject: OpenNgcObject, observerLocation?: ObserverLocation) {
    const osoObjectCoords = new AstronomicalCoordinates(dsoObject.rightAscension, dsoObject.declination);
    const bodyCoordsFunction = this.ephemerides.buildCoordinatesFunction(bodyId, observerLocation);
    return (es: number) => Radians.separation(bodyCoordsFunction(es), osoObjectCoords)
  }

  buildSeparationFunctionForDso(dsoObject: OpenNgcObject) {
    const dsoCoords = new AstronomicalCoordinates(dsoObject.rightAscension, dsoObject.declination);
    return (coordsInTime: CoordinatesInTime) => Radians.separation(coordsInTime.coords, dsoCoords);
  }

  find(bodyIdies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number, observerLocation: ObserverLocation): DsoConjunction[] {
    const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    const esArray = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL);

    console.log(`Computing ${esArray.length} ephemeris for ${bodyIdies.length} bodies`);
    console.time('Ephemerides computed');

    const ephemerides = bodyIdies.map(bodyId => {
      const coordinatesFunction = this.ephemerides.buildCoordinatesFunction(bodyId, observerLocation);
      return {
        bodyId,
        ephemerides: esArray.map(es => ({
          es,
          coords: coordinatesFunction(es)
        }))
      }
    });

    console.timeEnd('Ephemerides computed');

    console.log('Finding conjunction candidates using Clusters');
    console.time('Candidates found in');
    const candidates = ephemerides.flatMap<ConjunctionPredictionRange>(({ bodyId, ephemerides }) =>
      findConjuctionCandidates(ephemerides, this.catalogueClusters)
        .map(conjunctionCandidate => ({
          bodyId,
          ...conjunctionCandidate
        }))
    );

    console.timeEnd('Candidates found in');
    console.log(`Candidates: ${candidates.length}`);

    console.log('Merging candidates wit the same DSO');
    console.time('Merged candidates in');

    const mergedCandidates = Array.from(candidates
      .reduce((acc, newCandidate) => {
        const candidateId = `${newCandidate.bodyId}-${newCandidate.dso.name}`;
        const existingCandidate = acc.get(candidateId);
        if (existingCandidate) {
          existingCandidate.fromEs = Math.min(existingCandidate.fromEs, newCandidate.fromEs);
          existingCandidate.toEs = Math.min(existingCandidate.toEs, newCandidate.toEs);
        } else {
          acc.set(candidateId, { ...newCandidate });
        }
        return acc;
      }, new Map<string, ConjunctionPredictionRange>())
      .values());

    console.timeEnd('Merged candidates in');
    console.log(`Candidates after merging: ${mergedCandidates.length}`);

    console.log('Finding minimums in candidates using fixed interval method');
    console.time('Minimums found in candidates in');

    const filteredCandidates = mergedCandidates.flatMap(({ bodyId, dso, fromEs, toEs }) => {
      const coordinatesFunction = this.ephemerides.buildCoordinatesFunction(bodyId, observerLocation);
      const separationFunction = this.buildSeparationFunctionForDso(dso);
      const coords = EphemerisSeconds
        .forRange(fromEs - PRELIMINARY_INTERVAL, toEs + PRELIMINARY_INTERVAL, DETAILED_INTERVAL)
        .map(es => ({
          es,
          coords: coordinatesFunction(es)
        }));
      const { minimums } = findSampledLocalExtremums<CoordinatesInTime>(coords, separationFunction);
      return minimums.map(minimum => ({
        dso,
        bodyId,
        es: minimum.es
      }));
    });

    console.timeEnd('Minimums found in candidates in');
    console.log(`Minimums found: ${filteredCandidates.length}`);

    console.log('Finding conjunctions using local minimum golden ratio method');
    console.time('Conjunctions found in');

    const conjuctions = filteredCandidates
      .map(({ bodyId, dso, es }) => {
        const separationFunction = this.buildSeparationFunction(bodyId, dso, observerLocation);
        const a = es - DETAILED_INTERVAL;
        const b = es;
        const c = es + DETAILED_INTERVAL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [eventEs, minSeparation, resultRangeWidth, iterations] = findLocalMinimumByGoldenSection(separationFunction, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        return {
          es: eventEs,
          bodyId,
          dso,
          separation: minSeparation
        }
      })
      .filter(({ separation }) => separation < separationLimit)
      .map<DsoConjunction>(({ es, bodyId, dso, separation }) => {
        const ephemeris = this.ephemerides.fullCoordinates(bodyId, es, observerLocation);
        const separationFactorValue = separationFactor(separation, ephemeris.angularSize, getAverageAngularSize(dso));
        return {
          ...timeProperties(es),
          body: {
            info: jplBodyFromId(bodyId),
            ephemeris
          },
          dso,
          separation,
          separationFactor: Math.round(separationFactorValue * 10) / 10
        }
      })
      .filter(dsoConjunction => dsoConjunction.separationFactor <= SEPARATION_FACTOR_THRESHOLD);

    console.timeEnd('Conjunctions found in');
    console.log(`Conjunctions found: ${conjuctions.length}`);

    return conjuctions.sort(esOrder);;
  }

  findConjunctionsWithDso(fromJde: number, toJde: number, observerLocation: ObserverLocation): DsoConjunction[] {
    const bodies = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    // const bodies = [JplBodyId.Moon, JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.find(bodies, fromJde, toJde, SEPARATION_THRESHOLD, observerLocation);
  }
}
