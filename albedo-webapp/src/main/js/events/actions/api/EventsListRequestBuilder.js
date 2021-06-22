import { EclipseEventsSettingsDrawer } from "../../eclipses/EclipseEventsSettingsDrawer";

export function buildEventsListRequestParams(fromDate, toDate, rtsSettings, conjunctionsSettings, eclipsesSettings, observerLocation, timeZone) {
    return {
        from: fromDate,
        to: toDate,
        ...observerLocation,
        timeZone: timeZone,
        rtsSunEnabled: rtsSettings.enabled && rtsSettings.sunEnabled,
        rtsMoonEnabled: rtsSettings.enabled && rtsSettings.moonEnabled,
        conjunctionsSunEnabled: conjunctionsSettings.enabled && conjunctionsSettings.sunEnabled,
        conjunctionsMoonEnabled: conjunctionsSettings.enabled && conjunctionsSettings.moonEnabled,
        conjunctionsPlanetsEnabled: conjunctionsSettings.enabled && conjunctionsSettings.planetsEnabled,
        conjunctionsCometsEnabled: conjunctionsSettings.enabled && conjunctionsSettings.cometsEnabled,
        conjunctionsAsteroidsEnabled: conjunctionsSettings.enabled && conjunctionsSettings.asteroidsEnabled,
        conjunctionsCataloguesDSEnabled: conjunctionsSettings.enabled && conjunctionsSettings.cataloguesDSEnabled,
        cFilterBlindedBySun: conjunctionsSettings.enabled && conjunctionsSettings.filterBlindedBySun,
        eclipsesEnabled: eclipsesSettings.enabled
    };
}
