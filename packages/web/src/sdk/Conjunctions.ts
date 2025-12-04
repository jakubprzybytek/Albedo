import { get } from "aws-amplify/api";
import type { Location } from "@/common/Profile";
import type { Conjunction, DsoConjunction } from '@lambda/conjunctions';

export type { Conjunction, DsoConjunction };

export type ConjunctionsQuery = {
  fromTde: string;
  toTde: string;
  location?: Location;
};

export async function getConjunctions(query: ConjunctionsQuery): Promise<Conjunction[]> {
  const path = '/api/conjunctions';
  const searchParams = {
    fromTde: query.fromTde,
    toTde: query.toTde,
    ...(query.location && {
      latitude: query.location.latitude.toString(),
      longitude: query.location.longitude.toString(),
      altitude: query.location.altitude.toString(),
    })
  };

  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: path + '?' + new URLSearchParams(searchParams).toString(),
  }).response;

  const bodyJson = await body.json() as unknown;
  return bodyJson as Conjunction[];
}

export async function getDsoConjunctions(query: ConjunctionsQuery): Promise<DsoConjunction[]> {
  const path = '/api/dso-conjunctions';
  const searchParams = {
    fromTde: query.fromTde,
    toTde: query.toTde,
    ...(query.location && {
      latitude: query.location.latitude.toString(),
      longitude: query.location.longitude.toString(),
      altitude: query.location.altitude.toString(),
    })
  };

  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: path + '?' + new URLSearchParams(searchParams).toString(),
  }).response;

  const bodyJson = await body.json() as unknown;
  return bodyJson as DsoConjunction[];
}
