export function buildEventsListRequestParams(fromDate, toDate, rtsSettings, conjunctionsSettings, observerLocation, timeZone) {
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
    };
}
