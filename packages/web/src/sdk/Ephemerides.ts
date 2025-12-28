import { get } from "aws-amplify/api";
import type { Location } from "@/common/Profile";
import type { FullEphemerisWithVelocity } from "@astro/scripts";

export type { FullEphemerisWithVelocity };

export type EphemeridesQuery = {
    target: string;
    fromTde: string;
    toTde: string;
    interval: number;
    location: Location;
};

export default async function getEphemerides(query: EphemeridesQuery): Promise<FullEphemerisWithVelocity[]> {
    const path = '/api/ephemeris';
    const params = {
        target: query.target,
        fromTde: query.fromTde,
        toTde: query.toTde,
        interval: String(query.interval),
        latitude: query.location.latitude.toString(),
        longitude: query.location.longitude.toString(),
        altitude: query.location.altitude.toString(),
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    const bodyJson = await body.json() as unknown;
    return bodyJson as FullEphemerisWithVelocity[];
}
