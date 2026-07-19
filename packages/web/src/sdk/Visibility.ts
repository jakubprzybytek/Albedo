import { get } from 'aws-amplify/api';
import type { Location } from '@/common/Profile';
import type { AltitudeTargetName, SolarEventType } from '@/components/Altitudes/altitudeTypes';
import type { SolarPhase } from '@/common/charts/astronomyChartConfig';

export type VisibilityEventDto = { tde: string; minuteOfDay: number; utcOffsetMinutes: number };
export type VisibilityTransitDto = VisibilityEventDto & { altitude: number };
export type VisibilityObjectDayDto = { rise: VisibilityEventDto | null; transit: VisibilityTransitDto | null; set: VisibilityEventDto | null };
export type VisibilityDayDto = {
  date: string;
  objects: Partial<Record<AltitudeTargetName, VisibilityObjectDayDto>>;
  solar: { phaseAtStart: SolarPhase; events: (VisibilityEventDto & { type: SolarEventType })[] };
};
export type VisibilityQuery = { targets: AltitudeTargetName[]; fromDate: string; toDate: string; timeZone: string; location: Location };
export type VisibilityResponse = { timeZone: string; fromDate: string; toDate: string; days: VisibilityDayDto[]; nextCursor: string | null };

export async function getVisibilityPage(query: VisibilityQuery, cursor?: string): Promise<VisibilityResponse> {
  const params = new URLSearchParams({
    targets: query.targets.join(','), fromDate: query.fromDate, toDate: query.toDate, timeZone: query.timeZone,
    latitude: String(query.location.latitude), longitude: String(query.location.longitude), altitude: String(query.location.altitude),
    ...(cursor ? { cursor } : {}),
  });
  const { body } = await get({ apiName: 'AlbedoAPI', path: `/api/visibility?${params}` }).response;
  const response = await body.json() as Partial<VisibilityResponse>;
  if (!Array.isArray(response.days) || typeof response.timeZone !== 'string' || !('nextCursor' in response)) {
    throw new Error('Visibility API returned an invalid response');
  }
  return response as VisibilityResponse;
}

export async function* iterateVisibilityPages(query: VisibilityQuery): AsyncGenerator<VisibilityResponse> {
  let cursor: string | undefined;
  const seen = new Set<string>();
  do {
    const page = await getVisibilityPage(query, cursor);
    yield page;
    if (page.nextCursor && seen.has(page.nextCursor)) throw new Error('Visibility API returned a repeated cursor');
    if (page.nextCursor) seen.add(page.nextCursor);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
}