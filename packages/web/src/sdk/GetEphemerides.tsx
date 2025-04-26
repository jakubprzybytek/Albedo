import { get } from "aws-amplify/api";
import type { Ephemeris } from '@lambda/ephemeris';

export type { Ephemeris };

export type EphemeridesQuery = {
    target: string;
    fromTde: string;
    toTde: string;
    interval: number;
};

export default async function getEphemerides(query: EphemeridesQuery): Promise<Ephemeris[]> {
    const path = '/api/ephemeris';
    const params = {
        ...query,
        interval: String(query.interval),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as any;
    return bodyJson as Ephemeris[];
}
