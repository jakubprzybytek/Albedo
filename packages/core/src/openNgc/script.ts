import { OpenNgcObject } from ".";
import { loadOpenNgc } from "./OpenNgcLoader";
import { Table } from "@utils/Table";

const CLUSTER_SIZE_DEG = 15.0;

function getClusterAddress(openNgcObject: OpenNgcObject): [number, number] {
  return [
    Math.floor(openNgcObject.rightAscensionDeg / CLUSTER_SIZE_DEG),
    Math.floor((openNgcObject.declinationDeg + 90) / CLUSTER_SIZE_DEG)
  ];
}

console.time('prep');

const openNgcObjects = loadOpenNgc('../../data/OpenNGC/database_files/NGC.csv');

const raClusters = Math.ceil(360 / CLUSTER_SIZE_DEG);
const decClusters = Math.ceil(180 / CLUSTER_SIZE_DEG);


const openNgcObjectTable = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>);
openNgcObjects.forEach(object => {
  const [raIndex, decIndex] = getClusterAddress(object);
  openNgcObjectTable.get(raIndex, decIndex).push(object);
});

const openNgcObjectOverlayedTable = new Table<OpenNgcObject[]>(raClusters, decClusters, () => new Array<OpenNgcObject>);
for (let x = 0; x < raClusters; x++) {
  for (let y = 0; y < decClusters; y++) {
    openNgcObjectOverlayedTable.get(x, y).push(
      ...(y > 0 && [
        ...openNgcObjectTable.get(x > 0 ? x - 1 : raClusters - 1, y - 1),
        ...openNgcObjectTable.get(x, y - 1),
        ...openNgcObjectTable.get(x < raClusters - 1 ? x + 1 : 0, y - 1)
      ] || []),
      ...openNgcObjectTable.get(x > 0 ? x - 1 : raClusters - 1, y),
      ...openNgcObjectTable.get(x, y),
      ...openNgcObjectTable.get(x < raClusters - 1 ? x + 1 : 0, y),
      ...(y < decClusters - 1 && [
        ...openNgcObjectTable.get(x > 0 ? x - 1 : raClusters - 1, y + 1),
        ...openNgcObjectTable.get(x, y + 1),
        ...openNgcObjectTable.get(x < raClusters - 1 ? x + 1 : 0, y + 1)
      ] || []),
    );
  }
}

console.timeEnd('prep');

// console.log(openNgcObjectOverlayedTable.get(3, 6));
// console.log(openNgcObjectOverlayedTable.get(3, 5));
