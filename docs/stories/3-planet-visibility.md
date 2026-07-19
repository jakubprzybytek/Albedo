# Planet visibility chart

## Objective

Add a dedicated chart that summarizes when selected Solar System objects rise, reach their highest altitude, and set on each day in a date range. The vertical axis represents calendar days and the horizontal axis represents time of day from `00:00` to `24:00`. Matching events on adjacent days are connected, producing tracks that show how observing times change through the season.

Overlay daylight and twilight as filled background bands. Because sunrise, sunset, and twilight times change from day to day, the bands form curved, hourglass-like regions over a sufficiently long range.

The page is intended to answer: "At what time of night, and during which part of the year, can I observe each selected object from my location?"

## Scope

### In scope

- A new authenticated page at `/visibility`, linked from the desktop and mobile navigation as **Visibility**.
- Observer latitude, longitude, and altitude inputs, reusing the existing observer-location fields and validation.
- A date range and a display time zone.
- Selection of Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune.
- One daily rise, upper-transit, and set event for each selected object when that event exists.
- Connected event tracks, with stable colors per object and distinct line styles or markers per event type.
- Filled bands for day, civil twilight, nautical twilight, astronomical twilight, and night.
- Tooltips containing the object or solar phase, event name, date, display time, and transit altitude where applicable.
- Loading, validation, API error, no-event, partial-event, and empty-result states.
- A dedicated authenticated API endpoint and reusable core calculations.
- Unit, handler, component, and end-to-end coverage.

### Out of scope

- Earth, the Sun as a selectable object, Pluto, natural satellites other than the Moon, stars, and deep-sky objects.
- Lower transit and more than one rise, upper-transit, or set event per civil day.
- Apparent magnitude, lunar phase, angular separation from the Sun, or a computed quality/visibility score.
- Atmospheric extinction, terrain, buildings, weather, and custom horizon profiles.
- Daylight-saving-rule editing or arbitrary fixed UTC offsets.
- Persisting queries, sharing them by URL, or exporting chart data or images.

## User interface

Create a dedicated **Visibility** page consistent with the existing query pages. Reuse the object colors and solar-phase colors from the Altitudes chart so the same object or phase has the same meaning on both pages.

### Inputs

| Input | Proposed initial value | Validation |
|---|---|---|
| Objects | All supported objects | At least one object; only values from the supported list |
| From date | January 1 of the current year in the display time zone | Valid calendar date and not after To date |
| To date | December 31 of the current year in the display time zone | Valid calendar date; range of at most ten calendar years from From date |
| Time zone | Browser IANA time zone | Valid IANA time-zone identifier |
| Latitude | Existing observer-location default | `-90` to `90` degrees |
| Longitude | Existing observer-location default | `-180` to `180` degrees |
| Altitude | Existing observer-location default | Existing observer-location validation |

Dates are civil dates in the selected time zone, not UTC instants. The query includes both endpoints. A range may contain at most ten complete calendar years: `toDate` must be earlier than the date obtained by adding ten years to `fromDate`. For example, `2026-01-01` through `2035-12-31` is valid, while `2026-01-01` through `2036-01-01` is not. This calendar-based rule handles leap years without converting the limit to a fixed number of days. The chart title or axis label must name the selected time zone, for example `Europe/Warsaw`, and tooltips must include its short offset or abbreviation where available.

Submitting a valid query replaces the current result. Disable submission while a request is running and prevent submission while client-side validation fails.

### Chart layout

- Draw the horizontal axis from `00:00` through `24:00` in the selected time zone. Use major ticks every 2 hours on desktop and every 4 hours on narrow screens.
- Draw the vertical axis as one row per civil date, ordered chronologically from top to bottom. For a full calendar year, January appears at the top and December at the bottom. Multi-year ranges continue in the same ascending order, with each following year below the preceding year.
- Use a continuous vertical scale so tracks can be connected between adjacent dates. Show fewer date labels when needed, while retaining every date in the data.
- Keep the plot vertically scrollable for long ranges. The date range determines plot height, with a minimum row height sufficient for pointer interaction; do not compress a year into an unreadable fixed-height chart. Virtualize or progressively render rows so a ten-year result remains responsive without placing every point and accessible table row in the DOM at once.
- Keep axes visible while scrolling when practical: the hour axis should remain available, and date labels should remain aligned with their rows.
- Provide a legend for both object colors and event styles. Clicking an object toggles all of its tracks. Clicking an event type toggles that event type for all objects.
- Hovering or focusing a track highlights that object and event type without changing the selected filters.

### Object event tracks

For each selected object, plot:

| Event | Proposed presentation |
|---|---|
| Rise | Dashed line with upward-triangle markers |
| Highest altitude (upper transit) | Solid line with circle markers |
| Set | Dotted line with downward-triangle markers |

- Give each object one stable, distinguishable color shared by its three event tracks.
- Connect the same event type only between consecutive civil dates on which that event exists.
- Break a track when an event is absent for a day. Do not interpolate across missing days, because this would hide circumpolar, never-rising, or solver-failure cases.
- Treat time of day as circular. When consecutive event times straddle midnight, split the segment at `24:00` and continue it at `00:00` on the next edge rather than drawing a long line across the middle of the chart.
- The tooltip shows the object, event name, civil date, local time to the nearest minute, UTC timestamp, and altitude for upper transit. Rise and set tooltips may show azimuth if the core solver can return it without a second calculation; azimuth is not required for the MVP.
- A transit below the geometric horizon is returned but is visually muted and identified as `below horizon`. This preserves useful information for objects that never rise while avoiding the implication that they are observable.

### Solar background

Fill each date row according to the Sun's altitude, using the same thresholds and phase colors as the Altitudes chart:

| Solar phase | Boundary |
|---|---:|
| Day | Sun at or above `-0.833 deg` |
| Civil twilight | `-6 deg` to `-0.833 deg` |
| Nautical twilight | `-12 deg` to `-6 deg` |
| Astronomical twilight | `-18 deg` to `-12 deg` |
| Night | Below `-18 deg` |

Construct each band from the event boundaries for adjacent dates so the boundary changes smoothly down the chart. The bands appear behind object tracks and grid lines and must retain enough contrast for all object colors.

The background must handle all valid solar patterns rather than assuming one dawn and one dusk of every type:

- If a phase spans midnight, render it as two intervals, ending at `24:00` and resuming at `00:00`.
- If no threshold crossing occurs on a date, determine the phase at local noon and local midnight and fill the applicable full-day interval. This covers polar day, polar night, and twilight-only days.
- If a daylight-saving transition creates a 23-hour or 25-hour civil day, still display a wall-clock axis from `00:00` to `24:00`. A nonexistent local-time interval has no events; repeated wall-clock times are disambiguated in the tooltip by UTC offset.

## Calculation rules

All object events are topocentric for the supplied observer location. Reuse the existing ephemeris and observer-coordinate calculations.

For each civil date, convert the date's local start and the following date's local start to UTC using the selected IANA time zone. Search that interval for events; its elapsed duration may be 23, 24, or 25 hours.

### Object events

- Rise and set are crossings of geometric topocentric altitude through `0 deg`. A negative-to-positive crossing is rise; a positive-to-negative crossing is set.
- Highest altitude means upper culmination: the maximum topocentric altitude in the civil-day interval associated with the object's upper meridian transit.
- Use coarse samples only to bracket roots and maxima, then refine event timestamps to within 60 seconds.
- Assign an event to the civil date containing its refined timestamp in the selected time zone. An event exactly at the next date's `00:00` belongs only to the next date.
- Return `null` for a rise or set that does not occur during that civil date.
- For the MVP, return the highest upper transit in the civil day if numerical or lunar motion produces more than one candidate. Do not substitute a boundary sample at `00:00` or `24:00` for a transit that lies outside the interval.
- Return transit altitude in degrees. Rise and set altitudes are implicitly `0 deg` and need not be repeated.

Atmospheric refraction is not applied to object rise and set. Consequently, these times are geometric and should not be presented as apparent upper-limb events.

### Solar events

Use the existing solar-event definitions and refinement behavior:

| Event | Direction | Sun altitude |
|---|---|---:|
| Sunrise | Rising | `-0.833 deg` |
| Sunset | Setting | `-0.833 deg` |
| Civil dawn | Rising | `-6 deg` |
| Civil dusk | Setting | `-6 deg` |
| Nautical dawn | Rising | `-12 deg` |
| Nautical dusk | Setting | `-12 deg` |
| Astronomical dawn | Rising | `-18 deg` |
| Astronomical dusk | Setting | `-18 deg` |

Solar events must also be refined to within 60 seconds and assigned to the civil date containing the event. Include enough phase-at-boundary information in the response to render full-day polar cases without inferring state from a missing event list.

## API contract

Add authenticated route `GET /api/visibility` with the same Cognito authorization, Lambda memory, timeout, and CORS conventions as the existing altitude route.

### Query parameters

| Parameter | Format |
|---|---|
| `targets` | Comma-separated, case-sensitive supported body names |
| `fromDate` | ISO calendar date, for example `2026-07-18` |
| `toDate` | ISO calendar date, inclusive |
| `timeZone` | IANA identifier, for example `Europe/Warsaw` |
| `latitude` | Decimal degrees |
| `longitude` | Decimal degrees |
| `altitude` | Metres above the reference ellipsoid |

Reject missing parameters, invalid dates or time zones, unsupported or duplicate targets, an empty target list, non-finite or out-of-range observer values, `fromDate > toDate`, and ranges reaching or exceeding the tenth anniversary of `fromDate` with HTTP 400 and the existing JSON error shape.

### Proposed response

Return UTC instants as ISO 8601 strings. Also return `minuteOfDay` for plotting because UTC-to-zoned-time conversion and daylight-saving ambiguity should have one authoritative server-side interpretation.

```json
{
	"timeZone": "Europe/Warsaw",
	"days": [
		{
			"date": "2026-07-18",
			"objects": {
				"Mars": {
					"rise": { "tde": "2026-07-18T23:18:42.000Z", "minuteOfDay": 78.7 },
					"transit": { "tde": "2026-07-18T03:07:11.000Z", "minuteOfDay": 307.2, "altitude": 31.42 },
					"set": { "tde": "2026-07-18T06:56:03.000Z", "minuteOfDay": 536.1 }
				}
			},
			"solar": {
				"phaseAtStart": "night",
				"events": [
					{ "type": "astronomicalDawn", "tde": "2026-07-18T00:15:12.000Z", "minuteOfDay": 135.2 },
					{ "type": "sunrise", "tde": "2026-07-18T02:47:31.000Z", "minuteOfDay": 287.5 }
				]
			}
		}
	]
}
```

`minuteOfDay` is in the inclusive plotting domain `0` to `1440`; ordinary events are below `1440`, while `1440` is reserved for a boundary exactly at the following midnight. The response contains every requested target exactly once per day. Missing rise, transit, or set values are represented explicitly as `null`. Days and solar events are ordered chronologically.

## States and accessibility

- If none of the selected objects has a rise, transit, or set in the range, show the solar background and an explanatory no-object-events message rather than an empty chart.
- If only some events are absent, render the available tracks and expose missing events in an accessible per-object summary for the affected day or range.
- API failures clear stale results and use the existing query error presentation.
- The chart must be keyboard reachable. Track points expose accessible labels equivalent to their tooltips; the chart is not the only source of event values.
- Provide a compact tabular view or accessible data table for the currently visible objects. It may be collapsed visually, but must support users who cannot interpret or operate the chart.
- Color must not be the only distinction: event type uses line style and marker shape, and solar phases have sufficient luminance separation.

## Acceptance criteria

1. An authenticated user can open `/visibility` from the desktop and mobile navigation.
2. The form reuses observer-location inputs, supports the eight existing altitude targets, defaults to January 1 through December 31 of the current year in the selected time zone, accepts inclusive civil dates and a valid IANA time zone, and prevents invalid submission.
3. A valid query displays dates in ascending order from top to bottom and wall-clock time from `00:00` to `24:00`, clearly labeled with the selected time zone. A full-year result places January at the top and December at the bottom; multi-year results place later years below earlier years.
4. Each available rise, upper-transit, and set event is plotted on the correct civil date and within one minute of the core solver result.
5. Events of the same object and type connect only across adjacent dates, split correctly at midnight, and do not bridge missing days.
6. Object color, event line style, markers, legend, filtering, and tooltips make tracks distinguishable without relying on color alone.
7. Day, civil twilight, nautical twilight, astronomical twilight, and night form continuous background bands using the same thresholds and palette as the Altitudes page.
8. Polar day, polar night, circumpolar objects, never-rising objects, and dates with only a subset of events render without an error or invented crossings.
9. A daylight-saving transition plots events at the correct wall-clock time and disambiguates a repeated time by UTC offset.
10. Ranges through ten calendar years are accepted; a range ending on the tenth anniversary of its start is rejected. Long results remain responsive and readable through virtualized or progressive vertical scrolling, and desktop and mobile layouts have no overlapping axes, legend, form, or tooltips.
11. Chart values are available through keyboard interaction and an accessible textual or tabular representation.
12. API failures, wholly empty object results, and partial results produce explicit states and do not leave stale data visible.
13. Existing altitude and ephemeris behavior and tests continue to pass.

## Implementation outline

1. Add reusable daily rise, set, and upper-transit calculations under `packages/core/src/astro/scripts/visibility/`. Reuse the existing topocentric coordinate function and solar threshold solver.
2. Add a time-zone-aware civil-day adapter. Use the project's date library if it supports IANA zones; otherwise add a focused library such as `date-fns-tz` rather than implementing daylight-saving rules manually.
3. Add `packages/functions/src/visibility/getVisibility.ts`, validate the request, serialize explicit missing events, and register `GET /api/visibility` in `infra/api.ts`.
4. Add typed wire models and an SDK call under `packages/web/src/sdk/`.
5. Add the route, form, scrollable chart, legends, tooltip, result states, and accessible table. Extract the existing object and solar-phase palettes to shared chart constants rather than duplicating them.
6. Unit-test root/maximization refinement, midnight ownership, circular line splitting, missing crossings, polar phases, inclusive ranges, the ten-calendar-year boundary, leap years, and 23/25-hour civil days.
7. Add handler contract tests and Playwright coverage for the current-year default, a ten-year range, midnight crossing, polar behavior, legend filtering, accessibility, mobile layout, and a daylight-saving transition.

## Product decisions to confirm

The story proposes the following decisions so implementation can proceed once they are confirmed or amended:

- **Time basis:** Use a selectable IANA civil time zone, initially the browser time zone. Alternative: keep UTC everywhere, which is simpler but less useful for planning an observing night.
- **Chart direction (confirmed):** Put the earliest date at the top and later dates downward. For a calendar year, January is at the top and December is at the bottom. Multi-year ranges retain this ascending order across year boundaries.
- **Default and maximum range (confirmed):** Default to the full current calendar year and allow up to ten complete calendar years. Long results require incremental calculation plus virtualized or progressive rendering to keep the API and browser responsive.
- **Objects:** Reuse the Altitudes page's eight-object allowlist and select all objects initially.
- **Rise and set definition:** Use geometric center crossing at `0 deg`, without refraction or object semidiameter. Moon and planet apparent rise/set conventions would require body-specific thresholds.
- **Highest altitude definition:** Use upper meridian transit even when it occurs below the horizon, and visually mute below-horizon transits.
- **Multiple events:** Return at most one rise, upper transit, and set per object per civil date. Confirm whether unusual high-latitude cases must expose every crossing.
- **Chart interaction:** Allow legend filtering but no zoom or brush in the MVP. Vertical scrolling provides detail for long ranges.
- **API shape:** Add a purpose-built daily-events endpoint rather than downloading dense altitude samples and deriving events in the browser.

