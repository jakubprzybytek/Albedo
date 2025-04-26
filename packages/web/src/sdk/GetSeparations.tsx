import { get } from "aws-amplify/api";
import type { SeparationWithBodies } from '@lambda/separations';

export type { SeparationWithBodies };

export type SeparationsQuery = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: number;
};

export default async function getSeparations(query: SeparationsQuery): Promise<SeparationWithBodies[]> {
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
    return bodyJson as SeparationWithBodies[];
}
