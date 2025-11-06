import { get } from "aws-amplify/api";
import type { EphemerisWithVelocity } from "@astro/scripts";

export type { EphemerisWithVelocity };

export type EphemeridesQuery = {
    target: string;
    fromTde: string;
    toTde: string;
    interval: number;
};

export default async function getEphemerides(query: EphemeridesQuery): Promise<EphemerisWithVelocity[]> {
    const path = '/api/ephemeris';
    const params = {
        ...query,
        interval: String(query.interval),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as unknown;
    return bodyJson as EphemerisWithVelocity[];
}
