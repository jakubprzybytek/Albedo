import { get } from "aws-amplify/api";
import type { Eclipse } from '@lambda/eclipses';
import { EclipseType } from '@lambda/eclipses';

export type { Eclipse };
export { EclipseType };

export type EclipsesQuery = {
  fromTde: string;
  toTde: string;
};

export default async function getEclipses(query: EclipsesQuery): Promise<Eclipse[]> {
  const path = '/api/eclipses';

  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: path + '?' + new URLSearchParams(query).toString(),
  }).response;

  const bodyJson = await body.json() as any;
  return bodyJson as Eclipse[];
}
