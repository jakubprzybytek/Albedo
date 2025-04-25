import { get } from "aws-amplify/api";
import type { Conjunction } from '@lambda/conjunctions';

export type { Conjunction };

export type ConjunctionsQuery = {
  fromTde: string;
  toTde: string;
};

export default async function getConjunctions(query: ConjunctionsQuery): Promise<Conjunction[]> {
  const path = '/api/conjunctions';

  const { body } = await get({
    apiName: 'AlbedoAPI',
    path: path + '?' + new URLSearchParams(query).toString(),
  }).response;

  const bodyJson = await body.json() as any;
  return bodyJson as Conjunction[];
}
