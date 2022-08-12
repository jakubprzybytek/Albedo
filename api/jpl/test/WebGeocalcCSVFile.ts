import { readFileSync } from "node:fs";
import { Readable } from 'stream';
import { parse } from 'csv-parse';

export type State = {
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

export type StatesWebGeocalcCSVFileContent = {
    targetBodyName: string;
    observerBodyName: string;
    states: State[];
}

const TARGET_BODY_NAME_REGEX = /"Target","([\w ]+)"/;
const OBSERVER_BODY_NAME_REGEX = /"Observer","([\w ]+)"/;
const STATES_REGEX = /^(.+,){10}.+$/gm;

const headers = ['tbd', 'distance', 'speed', 'x', 'y', 'z', 'speed_x', 'speed_y', 'speed_z', 'target_tbd', 'light_time'];

function createParser() {
    return parse({
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        //skipRecordsWithError: true,
        cast: (columnValue, context) => {
            if (context.column === 'distance' || context.column === 'speed'
                || context.column === 'x' || context.column === 'y' || context.column === 'z'
                || context.column === 'speed_x' || context.column === 'speed_y' || context.column === 'speed_z'
                || context.column === 'light_time') {
                return parseFloat(columnValue);
            }

            if (context.column === 'tbd' || context.column === 'target_tbd') {
                return new Date(Date.parse(columnValue.replace(' TDB', ' UTC')));
            }

            return columnValue;
        }
    })
};

function toLowerCase(name: string): string {
    return name.split(' ')
        .map((word) => word.charAt(0) + word.substring(1).toLocaleLowerCase())
        .join(' ');
}

export async function readStatesWebGeocalcCSVFile(fileName: string): Promise<StatesWebGeocalcCSVFileContent> {

    const fileContent = readFileSync(fileName).toString();

    const targetBodyNameMatch = TARGET_BODY_NAME_REGEX.exec(fileContent);

    if (targetBodyNameMatch === null) {
        throw Error("Target name not found!");
    }

    const observerBodyNameMatch = OBSERVER_BODY_NAME_REGEX.exec(fileContent);

    if (observerBodyNameMatch === null) {
        throw Error("Observer name not found!");
    }

    const statesMatch = fileContent.match(STATES_REGEX);

    if (statesMatch === null) {
        throw Error("State rows name not found!");
    }

    const targetBodyName = toLowerCase(targetBodyNameMatch[1]);
    const observerBodyName = toLowerCase(observerBodyNameMatch[1]);

    const csvContent = new Readable();
    csvContent.push(statesMatch.join('\n'));
    csvContent.push(null);

    const parser = csvContent.pipe(createParser());

    const states: State[] = [];
    for await (const state of parser) {
        states.push(state);
    }

    return {
        targetBodyName,
        observerBodyName,
        states
    }
}