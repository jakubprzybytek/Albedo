export type RectangularCoordsData = {
  tbd: Date;
  distance: number;
  speed: number;
  x: number;
  y: number;
  z: number;
  speed_x: number;
  speed_y: number;
  speed_z: number;
  target_tbd: Date;
  light_time: number;
};

export type AstronomicalCoordsData = {
  tbd: Date;
  rightAscension: number;
  declination: number;
  range: number;
  speed_rightAscension: number;
  speed_declination: number;
  speed_range: number;
  speed: number;
  target_tbd: Date;
  light_time: number;
};

export type WebGeocalcCSVFileContent<T> = {
  targetBodyName: string;
  observerBodyName: string;
  kernels: string[];
  data: T[];
}

const TARGET_BODY_NAME_REGEX = /"Target","([\w ]+)"/;
const OBSERVER_BODY_NAME_REGEX = /"Observer","([\w ]+)"/;
const CSV_ROW_REGEX = /^(.+,){9,10}.+$/gm;
const KERNELS_REGEX = /"Kernels Used"(.*)/s;

function parseRectangularCoordsRow(row: string): RectangularCoordsData {
  const values = row.split(',');

  if (values.length != 11) {
    throw new Error(`Invalid state row format, expected 10 columns, got ${values.length}`);
  }

  return {
    tbd: new Date(Date.parse(values[0].replace(' TDB', ' UTC'))),
    distance: parseFloat(values[1]),
    speed: parseFloat(values[2]),
    x: parseFloat(values[3]),
    y: parseFloat(values[4]),
    z: parseFloat(values[5]),
    speed_x: parseFloat(values[6]),
    speed_y: parseFloat(values[7]),
    speed_z: parseFloat(values[8]),
    target_tbd: new Date(Date.parse(values[9].replace(' TDB', ' UTC'))),
    light_time: parseFloat(values[10])
  }
}

function parseAstronomicalCoordsRow(row: string): AstronomicalCoordsData {
  const values = row.split(',');

  if (values.length != 10) {
    throw new Error(`Invalid state row format, expected 10 columns, got ${values.length}`);
  }

  return {
    tbd: new Date(Date.parse(values[0].replace(' TDB', ' UTC'))),
    rightAscension: parseFloat(values[1]),
    declination: parseFloat(values[2]),
    range: parseFloat(values[3]),
    speed_rightAscension: parseFloat(values[4]),
    speed_declination: parseFloat(values[5]),
    speed_range: parseFloat(values[6]),
    speed: parseFloat(values[7]),
    target_tbd: new Date(Date.parse(values[8].replace(' TDB', ' UTC'))),
    light_time: parseFloat(values[9])
  }
}

function toFancyLowerCase(name: string): string {
  return name.split(' ')
    .map((word) => word.charAt(0) + word.substring(1).toLocaleLowerCase())
    .join(' ');
}

export async function readCSVFile<T>(fileContent: string, parser: (row: string) => any): Promise<WebGeocalcCSVFileContent<T>> {
  const targetBodyNameMatch = TARGET_BODY_NAME_REGEX.exec(fileContent);
  if (targetBodyNameMatch === null) {
    throw Error("Target name not found!");
  }

  const observerBodyNameMatch = OBSERVER_BODY_NAME_REGEX.exec(fileContent);
  if (observerBodyNameMatch === null) {
    throw Error("Observer name not found!");
  }

  const stateMatches = fileContent.match(CSV_ROW_REGEX);
  if (stateMatches === null) {
    throw Error("State rows not found!");
  }

  const kernelsMatch = fileContent.match(KERNELS_REGEX);
  const kernels = kernelsMatch ? kernelsMatch[1].split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(kernel => kernel.replaceAll('"', '')) : [];

  const targetBodyName = toFancyLowerCase(targetBodyNameMatch[1]);
  const observerBodyName = toFancyLowerCase(observerBodyNameMatch[1]);

  const data: T[] = [];
  for (let i = 1; i < stateMatches.length; i++) {
    data.push(parser(stateMatches[i]));
  }

  return {
    targetBodyName,
    observerBodyName,
    kernels,
    data
  }
}

export async function readRectangularCoordsFromWebGeocalcCSVFile(fileContent: string): Promise<WebGeocalcCSVFileContent<RectangularCoordsData>> {
  return readCSVFile(fileContent, parseRectangularCoordsRow)
}

export async function readAstronomicalCoordsFromWebGeocalcCSVFile(fileContent: string): Promise<WebGeocalcCSVFileContent<AstronomicalCoordsData>> {
  return readCSVFile(fileContent, parseAstronomicalCoordsRow)
}
