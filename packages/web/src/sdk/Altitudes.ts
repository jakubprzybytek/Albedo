import { get } from 'aws-amplify/api';
import type { Location } from '@/common/Profile';
import type { AltitudeTargetName, SolarEventType } from '@/components/Altitudes/altitudeTypes';

export type AltitudeSampleDto = {
  tde: string;
  altitudes: Partial<Record<AltitudeTargetName, number>>;
};

export type SolarEventDto = {
  type: SolarEventType;
  tde: string;
};

export type AltitudesQuery = {
  targets: AltitudeTargetName[];
  fromTde: string;
  toTde: string;
  location: Location;
};

export type AltitudesResponse = {
  samples: AltitudeSampleDto[];
  solarEvents: SolarEventDto[];
};

export default async function getAltitudes(query: AltitudesQuery): Promise<AltitudesResponse> {
  const params = {
    targets: query.targets.join(','),
    fromTde: query.fromTde,
    toTde: query.toTde,
    latitude: query.location.latitude.toString(),
    longitude: query.location.longitude.toString(),
    altitude: query.location.altitude.toString(),
  };
  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: `/api/altitudes?${new URLSearchParams(params).toString()}`,
  }).response;
  const response = await body.json() as Partial<AltitudesResponse>;
  if (!Array.isArray(response.samples) || !Array.isArray(response.solarEvents)) {
    throw new Error('Altitude API returned an invalid response');
  }
  return response as AltitudesResponse;
}