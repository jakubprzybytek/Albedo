import { readFileSync } from "node:fs";
import { Readable } from 'stream';
import { parse, Parser } from 'csv-parse';

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
    data: T[];
}

const TARGET_BODY_NAME_REGEX = /"Target","([\w ]+)"/;
const OBSERVER_BODY_NAME_REGEX = /"Observer","([\w ]+)"/;
const CSV_ROW_REGEX = /^(.+,){9,10}.+$/gm;

const headersForRectangularCoords = ['tbd', 'distance', 'speed', 'x', 'y', 'z', 'speed_x', 'speed_y', 'speed_z', 'target_tbd', 'light_time'];
const headersForAstronomicalCoords = ['tbd', 'rightAscension', 'declination', 'range', 'speed_rightAscension', 'speed_declination', 'speed_range', 'speed', 'target_tbd', 'light_time'];

const numberHeaders = ['distance', 'speed', 'x', 'y', 'z', 'speed_x', 'speed_y', 'speed_z', 'rightAscension', 'declination', 'range', 'speed_rightAscension', 'speed_declination', 'speed_range', 'light_time'];
const dateHeaders = ['tbd', 'target_tbd'];

function createCSVParser(headers: string[]): Parser {
    return parse({
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        //skipRecordsWithError: true,
        cast: (columnValue, context) => {
            if (typeof context.column == 'string') {
                if (numberHeaders.includes(context.column)) {
                    return parseFloat(columnValue);
                }

                if (dateHeaders.includes(context.column)) {
                    return new Date(Date.parse(columnValue.replace(' TDB', ' UTC')));
                }
            }
            return columnValue;
        }
    })
};

function toFancyLowerCase(name: string): string {
    return name.split(' ')
        .map((word) => word.charAt(0) + word.substring(1).toLocaleLowerCase())
        .join(' ');
}

export async function readCSVFile<T>(fileContent: string, parser: Parser): Promise<WebGeocalcCSVFileContent<T>> {
    const targetBodyNameMatch = TARGET_BODY_NAME_REGEX.exec(fileContent);

    if (targetBodyNameMatch === null) {
        throw Error("Target name not found!");
    }

    const observerBodyNameMatch = OBSERVER_BODY_NAME_REGEX.exec(fileContent);

    if (observerBodyNameMatch === null) {
        throw Error("Observer name not found!");
    }

    const statesMatch = fileContent.match(CSV_ROW_REGEX);

    if (statesMatch === null) {
        throw Error("State rows not found!");
    }

    const targetBodyName = toFancyLowerCase(targetBodyNameMatch[1]);
    const observerBodyName = toFancyLowerCase(observerBodyNameMatch[1]);

    const csvContent = new Readable();
    csvContent.push(statesMatch.join('\n'));
    csvContent.push(null);

    const parserPipe = csvContent.pipe(parser);

    const data: T[] = [];
    for await (const state of parserPipe) {
        data.push(state);
    }

    return {
        targetBodyName,
        observerBodyName,
        data
    }
}

export async function readRectangularCoordsFromWebGeocalcCSVFile(fileContent: string): Promise<WebGeocalcCSVFileContent<RectangularCoordsData>> {
    return readCSVFile(fileContent, createCSVParser(headersForRectangularCoords))
}

export async function readAstronomicalCoordsFromWebGeocalcCSVFile(fileContent: string): Promise<WebGeocalcCSVFileContent<AstronomicalCoordsData>> {
    return readCSVFile(fileContent, createCSVParser(headersForAstronomicalCoords))
}
