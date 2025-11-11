import { OpenNgcObject } from ".";
import { loadOpenNgc } from "./OpenNgcLoader";

const CLUSTER_SIZE_DEG = 1.0;

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

const openNgcObjects = loadOpenNgc('../../data/OpenNGC/database_files/NGC.csv');

const clusteredOpenNgcObjects = groupBy(openNgcObjects, getClusterId);

clusteredOpenNgcObjects.forEach((groupCollection, groupId) => console.log(`${groupId}: ${groupCollection.length}`));

console.log(`Number of clusters: ${clusteredOpenNgcObjects.size}`);