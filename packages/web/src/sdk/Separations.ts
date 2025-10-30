import { get } from "aws-amplify/api";
import type { Separation } from '@lambda/separations';
import type { Location } from "@/components/Profile";

export type { Separation };

export type SeparationsQuery = {
    target: string;
    observer: string;
    fromTde: string;
    toTde: string;
    interval: number;
    location?: Location;
};

export default async function getSeparations(query: SeparationsQuery): Promise<Separation[]> {
    const path = '/api/separations';
    const params = {
        target: query.target,
        observer: query.observer,
        fromTde: query.fromTde,
        toTde: query.toTde,
        interval: String(query.interval),
        ...(query.location && {
            latitude: query.location.latitude.toString(),
            longitude: query.location.longitude.toString(),
            altitude: query.location.altitude.toString(),
        })
    };

    const { body } = await get({
        apiName: 'AlbedoAPI',
        path: path + '?' + new URLSearchParams(params).toString(),
    }).response;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bodyJson = await body.json() as unknown;
    return bodyJson as Separation[];
}
