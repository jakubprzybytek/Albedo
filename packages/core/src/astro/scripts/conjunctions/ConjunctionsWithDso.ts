import { AstronomicalCoordinates, ObserverLocation, Radians } from "@astro/coords";
import { DsoConjunction, Ephemerides, timeProperties } from "@astro/scripts";
import { JplBodyId, jplBodyFromId, EphemerisSeconds } from "@jpl";
import { KernelsRepository } from "@jpl/kernels";
import { OpenNgcObject } from "@openNgc";
import { Table } from "@utils/Table";
import { findConjuctionCandidates, prepareCatalogueClusters } from "./dso/Catalogue";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { localExtremums } from "@astro/math";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const DETAILED_INTERVAL = EphemerisSeconds.fromDays(1 / 12);

const SEPARATION_THRESHOLD = Radians.fromDegrees(0.5);

export type CoordinatesInTime = {
  es: number;
  coords: AstronomicalCoordinates;
}

export class ConjunctionsWithDso {

  readonly ephemerides: Ephemerides;

  readonly catalogueClusters: Table<OpenNgcObject[]>;

  constructor(kernels: KernelsRepository, dsoObjects: OpenNgcObject[]) {
    this.ephemerides = new Ephemerides(kernels);
    this.catalogueClusters = prepareCatalogueClusters(dsoObjects);
  }

  private buildSeparationFunction(bodyId: JplBodyId, dsoObject: OpenNgcObject, observerLocation?: ObserverLocation) {
    const osoObjectCoords = new AstronomicalCoordinates(
      Radians.fromDegrees(dsoObject.rightAscensionDeg),
      Radians.fromDegrees(dsoObject.declinationDeg)
    );
    const bodyCoordsFunction = this.ephemerides.buildCoordinatesFunction(bodyId, observerLocation);
    return (es: number) => Radians.separation(bodyCoordsFunction(es), osoObjectCoords)
  }

  buildSeparationFunctionForDso(dsoObject: OpenNgcObject) {
    const dsoCoords = new AstronomicalCoordinates(Radians.fromDegrees(dsoObject.rightAscensionDeg), Radians.fromDegrees(dsoObject.declinationDeg));
    return (coordsInTime: CoordinatesInTime) => Radians.separation(coordsInTime.coords, dsoCoords);
  }

  find(bodyIdies: JplBodyId[], fromJde: number, toJde: number, separationLimit: number, observerLocation?: ObserverLocation): DsoConjunction[] {
    const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    const esArray = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL);

    console.log(`Computing ${esArray.length} ephemeris for ${bodyIdies.length} bodies`);
    console.time('Ephemerides computed');

    const ephemerides = bodyIdies
      .map(bodyId => {
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
    const candidates = ephemerides
      .flatMap(({ bodyId, ephemerides }) =>
        findConjuctionCandidates(ephemerides, this.catalogueClusters)
          .map(conjunctionCandidate => ({
            bodyId,
            ...conjunctionCandidate
          }))
      );

    console.timeEnd('Candidates found in');
    console.log(`Candidates: ${candidates.length}`);

    console.log('Finding minimums in candidates using fixed interval method');
    console.time('Minimums found in candidates in');

    const filteredCandidates = candidates.flatMap(({ bodyId, dsoObject, fromEs, toEs }) => {
      const coordinatesFunction = this.ephemerides.buildCoordinatesFunction(bodyId, observerLocation);
      const separationFunction = this.buildSeparationFunctionForDso(dsoObject);
      const separations = EphemerisSeconds
        .forRange(fromEs - PRELIMINARY_INTERVAL, toEs + PRELIMINARY_INTERVAL, DETAILED_INTERVAL)
        .map(es => ({
          es,
          coords: coordinatesFunction(es)
        }));
      const { minimums } = localExtremums<CoordinatesInTime>(separations, separationFunction);
      return minimums.map(minimum => ({
        dsoObject,
        bodyId,
        es: minimum.es
      }));
    });

    console.timeEnd('Minimums found in candidates in');
    console.log(`Minimums found: ${filteredCandidates.length}`);

    console.log('Finding conjunctions using local minimum golden ratio method');
    console.time('Conjunctions found in');

    const conjuctions = filteredCandidates
      .map(({ bodyId, dsoObject, es }) => {
        const separationFunction = this.buildSeparationFunction(bodyId, dsoObject, observerLocation);
        const a = es - DETAILED_INTERVAL;
        const b = es;
        const c = es + DETAILED_INTERVAL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(separationFunction, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        return {
          es: eventEs,
          bodyId,
          dsoObject,
          separation: minSeparation
        }
      })
      .filter(({ separation }) => separation < separationLimit)
      .map<DsoConjunction>(({ es, bodyId, dsoObject, separation }) => ({
        ...timeProperties(es),
        body: {
          info: jplBodyFromId(bodyId),
          ephemeris: this.ephemerides.detailedCoordinatesForBody2(bodyId, es, observerLocation)
        },
        dso: dsoObject,
        separation
      }));

    console.timeEnd('Conjunctions found in');
    console.log(`Conjunctions found: ${conjuctions.length}`);

    return conjuctions;
  }

  findConjunctionsWithDso(fromJde: number, toJde: number, observerLocation?: ObserverLocation): DsoConjunction[] {
    // const bodies = [JplBodyId.Mercury];
    const bodies = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    // const bodies = [JplBodyId.Moon, JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto];
    return this.find(bodies, fromJde, toJde, SEPARATION_THRESHOLD, observerLocation);
  }
}
