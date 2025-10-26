import { get } from "aws-amplify/api";
import type { Location } from "@/components/Profile";
import type { Conjunction } from '@lambda/conjunctions';

export type { Conjunction };

export type ConjunctionsQuery = {
  fromTde: string;
  toTde: string;
  location?: Location;
};

export default async function getConjunctions(query: ConjunctionsQuery): Promise<Conjunction[]> {
  const path = '/api/conjunctions';
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

  const bodyJson = await body.json() as any;
  return bodyJson as Conjunction[];
}
