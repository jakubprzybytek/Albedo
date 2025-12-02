import { openSync, writeSync, closeSync } from 'node:fs';
import { loadOpenNgc } from "../OpenNgcLoader";
import { OpenNgcObject } from '@openNgc';

function writeOpenNgcObjects(fileName: string, openNgcObjects: OpenNgcObject[]) {
  const fd = openSync(fileName, 'w');
  writeSync(fd, JSON.stringify(openNgcObjects, null, 2));
  closeSync(fd);
}

const ROOT_FOLDER = '../../data/OpenNGC';

const OUTPUT_FOLDER = `${__dirname}/generated/`;

console.time('Generate OpenNGC objets file');

const mainOpenNgcObjects = loadOpenNgc(ROOT_FOLDER + '/database_files/NGC.csv');
const addendumOpenNgcObjects = loadOpenNgc(ROOT_FOLDER + '/database_files/addendum.csv');

const openNgcObjects = [...mainOpenNgcObjects, ...addendumOpenNgcObjects];

writeOpenNgcObjects(OUTPUT_FOLDER + '/openNgcObjects.full.json', openNgcObjects);
// writeOpenNgcObjects(OUTPUT_FOLDER + '/openNgcObjects.testData.json', openNgcObjects.slice(1000, 1099));

console.timeEnd('Generate OpenNGC objets file');
