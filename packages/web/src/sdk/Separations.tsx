import { get } from "aws-amplify/api";
import type { Separation } from '@lambda/separations';

export type { Separation };

export type SeparationsQuery = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: number;
};

export default async function getSeparations(query: SeparationsQuery): Promise<Separation[]> {
    const path = '/api/separations';
    const params = {
        ...query,
        interval: String(query.interval),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as any;
    return bodyJson as Separation[];
}
