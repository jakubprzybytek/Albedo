import { addDays, format } from 'date-fns';

export function buildEventsListRequestParams(settings, observerLocation, timeZone) {
    return {
        from: format(new Date(), "yyyy-MM-dd"),
        to: format(addDays(new Date(), 3), "yyyy-MM-dd"),
        ...observerLocation,
        timeZone: timeZone,
        rtsSunEnabled: settings.rts.enabled && settings.rts.sunEnabled,
        rtsMoonEnabled: settings.rts.enabled && settings.rts.moonEnabled,
        conjunctionsSunEnabled: settings.conjunctions.enabled && settings.conjunctions.sunEnabled,
        conjunctionsMoonEnabled: settings.conjunctions.enabled && settings.conjunctions.moonEnabled,
        conjunctionsPlanetsEnabled: settings.conjunctions.enabled && settings.conjunctions.planetsEnabled,
        conjunctionsCometsEnabled: settings.conjunctions.enabled && settings.conjunctions.cometsEnabled,
        conjunctionsAsteroidsEnabled: settings.conjunctions.enabled && settings.conjunctions.asteroidsEnabled,
        conjunctionsCataloguesDSEnabled: settings.conjunctions.enabled && settings.conjunctions.cataloguesDSEnabled,
    };
}