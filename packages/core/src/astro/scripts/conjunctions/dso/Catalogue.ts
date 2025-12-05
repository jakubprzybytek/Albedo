import { Table } from "@utils/Table";
import { OpenNgcObject } from "@openNgc";
import { AstronomicalCoordinates, Radians } from "@astro/coords";

const CLUSTER_SIZE_DEG = 1.0;
const MIN_DECLINATION_DEG = -30.0;
const MAX_DECLINATION_DEG = 30.0;

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
  dsoObject: OpenNgcObject;
};

function getClusterAddress(rightAscensionDeg: number, declinationDeg: number): ClusterAddress {
  return {
    column: Math.floor(rightAscensionDeg / CLUSTER_SIZE_DEG),
    row: Math.floor((declinationDeg - MIN_DECLINATION_DEG) / CLUSTER_SIZE_DEG)
  };
}

export function prepareCatalogueClusters(objects: OpenNgcObject[]): Table<OpenNgcObject[]> {
  const raClusters = Math.ceil(360 / CLUSTER_SIZE_DEG);
  const decClusters = Math.ceil((MAX_DECLINATION_DEG - MIN_DECLINATION_DEG) / CLUSTER_SIZE_DEG);

  const clusters = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>());

  objects.filter(object => object.declinationDeg >= MIN_DECLINATION_DEG && object.declinationDeg < MAX_DECLINATION_DEG)
    .forEach(object => {
      const { column, row } = getClusterAddress(object.rightAscensionDeg, object.declinationDeg);
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
  return dsoObjects.map(dsoObject => ({
    fromEs,
    toEs,
    dsoObject
  }));
}

export function findConjuctionCandidates(objectPath: CoordinatesInTime[], catalogueClusters: Table<OpenNgcObject[]>): ConjunctionCandidate[] {
  if (objectPath.length == 0) {
    return [];
  }

  const conjunctionCandidates: ConjunctionCandidate[] = [];

  let currentClusterFirstIndex = 0;
  let currentCluster = getClusterAddress(
    Radians.toDegrees(objectPath[0].coords.rightAscension),
    Radians.toDegrees(objectPath[0].coords.declination)
  );

  for (let i = 1; i < objectPath.length; i++) {
    const nextCluster = getClusterAddress(
      Radians.toDegrees(objectPath[i].coords.rightAscension),
      Radians.toDegrees(objectPath[i].coords.declination)
    );

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