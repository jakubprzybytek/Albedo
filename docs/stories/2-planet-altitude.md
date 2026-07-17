# Planet altitude chart

## Objective

Add a dedicated page that shows the topocentric altitude of selected Solar System objects over time for an Earth-based observer. Annotate the chart with sunrise, sunset, civil dawn and dusk, nautical dawn and dusk, and astronomical dawn and dusk.

The page is intended to answer: "Which selected objects are above the horizon during dark-sky hours at my location?"

## Scope

### In scope

- A new authenticated page at `/altitudes`, linked from the desktop and mobile navigation as **Altitudes**.
- Observer latitude, longitude, and altitude inputs, using the existing observer-location fields and validation.
- UTC start and end date-time inputs.
- A multi-select containing:
	- Sun
	- Moon
	- Mercury
	- Venus
	- Mars
	- Jupiter
	- Saturn
	- Uranus
	- Neptune
- A responsive line chart with one altitude series per selected object.
- A horizontal horizon reference at `0 deg`.
- Vertical annotations for solar events in the requested period.
- Loading, validation, API error, no-event, and empty-result states.
- A dedicated authenticated API endpoint and reusable core calculation code.
- Unit, handler, component, and end-to-end coverage for the new behavior.

### Out of scope

- Earth, Pluto, natural satellites other than the Moon, stars, and deep-sky objects.
- Rise, set, transit, or visibility annotations for objects other than the Sun.
- Atmospheric extinction, terrain, buildings, and a custom horizon profile.
- Weather, cloud cover, apparent magnitude, and recommended observing windows.
- Persisting queries or sharing them by URL.
- Exporting chart data or images.

## User interface

Create a dedicated **Altitudes** page consistent with the existing query pages.

### Inputs

| Input | Initial value | Validation |
|---|---|---|
| Objects | Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune | At least one object; only values from the supported list |
| Start (UTC) | Current time, rounded down to 10 minutes | Valid date-time and earlier than End |
| End (UTC) | Start plus 24 hours | Valid date-time; no more than 7 days after Start |
| Latitude | Existing observer-location default | `-90` to `90` degrees |
| Longitude | Existing observer-location default | `-180` to `180` degrees |
| Altitude | Existing observer-location default | Existing observer-location validation |

Use date-time controls, not date-only controls. Labels and tooltip timestamps must explicitly say UTC; browser or observer-local time conversion is not part of this story.

Submitting a valid query replaces the current result. Disable submission while a request is running and prevent submission while client-side validation fails.

### Chart behavior

- Plot time on the x-axis and geometric topocentric altitude in degrees on the y-axis.
- Use a fixed y-axis domain of `-90` to `90` degrees and draw a labeled horizon reference at `0 deg`.
- Give every selected object a stable, distinguishable color and include it in the legend.
- Clicking a legend item toggles that series, following the existing Recharts convention.
- The tooltip shows the UTC timestamp and each visible object's altitude to two decimal places.
- Draw and label a vertical marker for every solar event returned by the API.
- If several event labels would overlap, stagger or abbreviate the labels while retaining the full event name in a tooltip.
- On mobile, the chart must remain horizontally readable without labels overlapping the form or legend.
- If no solar threshold is crossed in the period, render the altitude series normally and show no event markers. This is expected at polar locations.
- If the API returns no samples, show a clear empty-result message instead of an empty chart.

## Calculation rules

Altitude is the geometric topocentric altitude already produced by `Ephemerides.buildFullCoordinatesFunction`. Values are expressed in degrees in the API response.

Generate samples at a fixed 10-minute interval, including Start and including End as an additional final sample when End does not fall on the interval. The endpoint must reject ranges longer than 7 days to bound runtime and response size.

Solar events are crossings of the Sun's topocentric altitude through these conventional thresholds:

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

Use coarse samples only to bracket a crossing, then refine its timestamp with bisection or another root finder until the bracket is at most 60 seconds. Determine dawn versus dusk from the crossing direction. Return only events whose refined timestamps are inside the inclusive requested range. The Sun must be calculated internally for event detection even when it is not selected as a chart series.

The sunrise and sunset threshold approximates the Sun's apparent upper-limb crossing. Other plotted altitudes remain geometric; atmospheric refraction is otherwise out of scope.

## API contract

Add authenticated route `GET /api/altitudes` with the same Cognito authorization, Lambda memory, timeout, and CORS conventions as the existing ephemeris route.

### Query parameters

| Parameter | Format |
|---|---|
| `targets` | Comma-separated, case-sensitive body names from the supported list |
| `fromTde` | ISO 8601 UTC timestamp, for example `2026-07-16T20:00:00Z` |
| `toTde` | ISO 8601 UTC timestamp |
| `latitude` | Decimal degrees |
| `longitude` | Decimal degrees |
| `altitude` | Metres above the reference ellipsoid |

Reject missing or non-finite numeric parameters, invalid dates, unsupported or duplicate targets, an empty target list, `fromTde >= toTde`, and ranges longer than 7 days with HTTP 400 and the existing JSON error shape.

### Response

```json
{
	"samples": [
		{
			"tde": "2026-07-16T20:00:00.000Z",
			"altitudes": {
				"Mars": 12.34,
				"Moon": -4.56
			}
		}
	],
	"solarEvents": [
		{
			"type": "civilDusk",
			"tde": "2026-07-16T21:47:12.000Z"
		}
	]
}
```

`solarEvents.type` is one of `sunrise`, `sunset`, `civilDawn`, `civilDusk`, `nauticalDawn`, `nauticalDusk`, `astronomicalDawn`, or `astronomicalDusk`. Samples and events must be ordered chronologically. Each sample must contain every requested target exactly once.

## Acceptance criteria

1. An authenticated user can open `/altitudes` from either navigation menu.
2. The form starts with all supported objects selected and a 24-hour UTC range.
3. Invalid location, target, or time-range input is explained inline and cannot be submitted.
4. A valid query displays one altitude line per selected object, a `0 deg` horizon, UTC axes/tooltips, and a legend that can toggle series.
5. The API returns samples every 10 minutes and a final End sample when required, with each altitude matching the existing topocentric ephemeris calculation.
6. Sunrise, sunset, civil dawn/dusk, nautical dawn/dusk, and astronomical dawn/dusk markers appear when their threshold crossings fall in the requested period and are accurate to within 60 seconds of the core solver's crossing.
7. A valid polar-location query with no threshold crossing still displays the object series without an error.
8. API failures and empty responses produce explicit UI states and do not leave a stale chart visible.
9. The form and chart work at the existing Playwright desktop and mobile viewport sizes without controls or labels overlapping.
10. Existing ephemeris behavior and tests continue to pass.

## Implementation outline

1. Add a core altitude-series service under `packages/core/src/astro/scripts/altitudes/`. Reuse the ephemeris topocentric coordinate function and add solar-threshold crossing refinement.
2. Add `packages/functions/src/altitudes/getAltitudes.ts`, parse and validate the request, and register `GET /api/altitudes` in `infra/api.ts`.
3. Add typed request and response models plus an SDK call under `packages/web/src/sdk/`.
4. Add the route module, query form, responsive Recharts chart, and result-state handling; register `/altitudes` in `packages/web/app/routes.ts` and both menus through the shared navigation item list.
5. Unit-test sampling, endpoint inclusion, all four solar thresholds, event direction, event precision, no-crossing periods, and validation boundaries.
6. Add a handler test for the API contract and Playwright coverage for submission, chart rendering, legend interaction, error handling, and a mobile viewport.

## Product decisions to confirm

The specification above makes these MVP decisions so implementation can start. Confirm or amend them before development:

- UTC is used everywhere instead of adding an observer timezone input.
- All nine supported objects are selected initially.
- The maximum range is 7 days with a fixed 10-minute sample interval.
- The conventional `-0.833 deg` sunrise/sunset threshold is acceptable even though the underlying altitude calculation does not otherwise model atmospheric refraction.