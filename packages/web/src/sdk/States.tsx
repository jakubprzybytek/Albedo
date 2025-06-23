import { get } from "aws-amplify/api";
import type { StateResult } from '@lambda/states';

export type { StateResult };

export type StatesQuery = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: number;
    correction: string;
};

export default async function getStates(query: StatesQuery): Promise<StateResult[]> {
    const path = '/api/states';
    const params = {
        ...query,
        interval: String(query.interval),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as any;
    return bodyJson as StateResult[];
}
