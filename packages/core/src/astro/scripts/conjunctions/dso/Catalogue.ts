import { Table } from "@utils/Table";
import { OpenNgcObject } from "@openNgc";

const CLUSTER_SIZE_DEG = 15.0;
const MIN_DECLINATION_DEG = -30.0;
const MAX_DECLINATION_DEG = 30.0;

export function getClusterAddress(openNgcObject: OpenNgcObject): [number, number] {
  return [
    Math.floor(openNgcObject.rightAscensionDec / CLUSTER_SIZE_DEG),
    Math.floor((openNgcObject.declinationDec - MIN_DECLINATION_DEG) / CLUSTER_SIZE_DEG)
  ];
}

export function prepareCatalogueClusters(objects: OpenNgcObject[]): Table<OpenNgcObject[]> {
  const raClusters = Math.ceil(360 / CLUSTER_SIZE_DEG);
  const decClusters = Math.ceil((MAX_DECLINATION_DEG - MIN_DECLINATION_DEG) / CLUSTER_SIZE_DEG);

  const clusters = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>());

  objects.filter(object => object.declinationDec >= MIN_DECLINATION_DEG && object.declinationDec < MAX_DECLINATION_DEG)
    .forEach(object => {
      const [raIndex, decIndex] = getClusterAddress(object);
      clusters.get(raIndex, decIndex).push(object);
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
