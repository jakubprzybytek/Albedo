import { object } from "zod";
import { OpenNgcObject, OpenNgcObjectType } from ".";
import { loadOpenNgc } from "./OpenNgcLoader";

const CLUSTER_SIZE_DEG = 15.0;

function getClusterId(object: OpenNgcObject): string {
  const raClusterId = Math.floor(object.rightAscensionDec / CLUSTER_SIZE_DEG);
  const decClusterId = Math.floor(object.declinationDec / CLUSTER_SIZE_DEG);
  if (Number.isNaN(raClusterId)) {
    console.error(object);
  }
  return `${raClusterId}#${decClusterId}`;
}

function groupBy<T>(collection: T[], getGroupId: (object: T) => string): Map<string, T[]> {
  return collection.reduce((acc, object) => {
    const groupId = getGroupId(object);
    const groupCollection = acc.get(groupId);
    if (groupCollection === undefined) {
      acc.set(groupId, [object]);
    } else {
      groupCollection.push(object);
    }
    return acc;
  }, new Map<string, T[]>());
}

class Table {
  private table: OpenNgcObject[][][];

  constructor(readonly columns: number, readonly rows: number) {
    this.table = Array.from({ length: columns }, () => Array.from({ length: rows }, () => new Array<OpenNgcObject>));
  }

  get(column: number, row: number): OpenNgcObject[] {
    if (column >= this.columns || row >= this.rows) {
      throw new Error(`Out of index: (${column}, ${row}) for table (${this.columns}, ${this.rows})`);
    }
    return this.table[column][row];
  }
}

function getClusterAddress(openNgcObject: OpenNgcObject): [number, number] {
  return [
    Math.floor(openNgcObject.rightAscensionDec / CLUSTER_SIZE_DEG),
    Math.floor((openNgcObject.declinationDec + 90) / CLUSTER_SIZE_DEG)
  ];
}

console.time('prep');

const openNgcObjects = loadOpenNgc('../../data/OpenNGC/database_files/NGC.csv');

// const clusteredOpenNgcObjects = groupBy(openNgcObjects, getClusterId);
// clusteredOpenNgcObjects.forEach((groupCollection, groupId) => console.log(`${groupId}: ${groupCollection.length}`));
// console.log(`Number of clusters: ${clusteredOpenNgcObjects.size}`);

const raClusters = Math.ceil(360 / CLUSTER_SIZE_DEG);
const decClusters = Math.ceil(180 / CLUSTER_SIZE_DEG);

const openNgcObjectTable = new Table(raClusters, decClusters);
openNgcObjects.forEach(object => {
  const [raIndex, decIndex] = getClusterAddress(object);
  openNgcObjectTable.get(raIndex, decIndex).push(object);
});

const openNgcObjectOverlayedTable = new Table(raClusters, decClusters);
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
