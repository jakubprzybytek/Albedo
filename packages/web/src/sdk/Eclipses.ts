import { get } from "aws-amplify/api";
import type { Location } from "@/common/Profile";
import type { Eclipse, SunEclipse, MoonEclipse } from '@lambda/eclipses';
import { EclipseType } from '@lambda/eclipses';

export type { Eclipse, SunEclipse, MoonEclipse };
export { EclipseType };

export type EclipsesQuery = {
  fromTde: string;
  toTde: string;
  location?: Location;
};

export default async function getEclipses(query: EclipsesQuery): Promise<Eclipse[]> {
  const path = '/api/eclipses';
  const searchParams = {
    fromTde: query.fromTde,
    toTde: query.toTde,
    ...(query.location && {
      latitude: query.location.latitude.toString(),
      longitude: query.location.longitude.toString(),
      altitude: query.location.altitude.toString(),
    }
    )
  };

  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: path + '?' + new URLSearchParams(searchParams).toString(),
  }).response;

  const bodyJson = await body.json() as unknown;
  return bodyJson as Eclipse[];
}
