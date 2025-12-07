import { Table } from "@utils/Table";
import { OpenNgcObject } from "@openNgc";
import { AstronomicalCoordinates, Radians } from "@astro/coords";

const CLUSTER_SIZE = Radians.fromDegrees(1.0);
const MIN_DECLINATION = Radians.fromDegrees(-30.0);
const MAX_DECLINATION = Radians.fromDegrees(30.0);

type ClusterAddress = {
  column: number;
  row: number;
}

type CoordinatesInTime = {
  es: number;
  coords: AstronomicalCoordinates;
}

export type ConjunctionCandidate = {
  toEs: number;
  fromEs: number;
  dso: OpenNgcObject;
};

function getClusterAddress(rightAscension: number, declination: number): ClusterAddress {
  return {
    column: Math.floor(rightAscension / CLUSTER_SIZE),
    row: Math.floor((declination - MIN_DECLINATION) / CLUSTER_SIZE)
  };
}

export function prepareCatalogueClusters(objects: OpenNgcObject[]): Table<OpenNgcObject[]> {
  const raClusters = Math.ceil(360 / CLUSTER_SIZE);
  const decClusters = Math.ceil((MAX_DECLINATION - MIN_DECLINATION) / CLUSTER_SIZE);

  const clusters = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>());

  objects.filter(object => object.declination >= MIN_DECLINATION && object.declination < MAX_DECLINATION)
    .forEach(object => {
      const { column, row } = getClusterAddress(object.rightAscension, object.declination);
      clusters.get(column, row).push(object);
    });

  const overlayedClusters = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>);

  for (let x = 0; x < raClusters; x++) {
    for (let y = 0; y < decClusters; y++) {
      overlayedClusters.get(x, y).push(
        ...(y > 0 && [
          ...clusters.get(x > 0 ? x - 1 : raClusters - 1, y - 1),
          ...clusters.get(x, y - 1),
          ...clusters.get(x < raClusters - 1 ? x + 1 : 0, y - 1)
        ] || []),
        ...clusters.get(x > 0 ? x - 1 : raClusters - 1, y),
        ...clusters.get(x, y),
        ...clusters.get(x < raClusters - 1 ? x + 1 : 0, y),
        ...(y < decClusters - 1 && [
          ...clusters.get(x > 0 ? x - 1 : raClusters - 1, y + 1),
          ...clusters.get(x, y + 1),
          ...clusters.get(x < raClusters - 1 ? x + 1 : 0, y + 1)
        ] || []),
      );
    }
  }

  return overlayedClusters;
}

function createCandidates(fromEs: number, toEs: number, dsoObjects: OpenNgcObject[]): ConjunctionCandidate[] {
  return dsoObjects.map(dso => ({
    fromEs,
    toEs,
    dso
  }));
}

export function findConjuctionCandidates(objectPath: CoordinatesInTime[], catalogueClusters: Table<OpenNgcObject[]>): ConjunctionCandidate[] {
  if (objectPath.length == 0) {
    return [];
  }

  const conjunctionCandidates: ConjunctionCandidate[] = [];

  let currentClusterFirstIndex = 0;
  let currentCluster = getClusterAddress(objectPath[0].coords.rightAscension, objectPath[0].coords.declination);

  for (let i = 1; i < objectPath.length; i++) {
    const nextCluster = getClusterAddress(objectPath[i].coords.rightAscension, objectPath[i].coords.declination);

    if (nextCluster.column != currentCluster.column || nextCluster.row != currentCluster.row) {
      const clusterObjects = catalogueClusters.get(currentCluster.column, currentCluster.row);
      conjunctionCandidates.push(...createCandidates(objectPath[currentClusterFirstIndex].es, objectPath[i - 1].es, clusterObjects)
      );

      currentClusterFirstIndex = i;
      currentCluster = nextCluster;
    }
  }

  const clusterObjects = catalogueClusters.get(currentCluster.column, currentCluster.row);
  conjunctionCandidates.push(...createCandidates(objectPath[currentClusterFirstIndex].es, objectPath[objectPath.length - 1].es, clusterObjects));

  return conjunctionCandidates;
}