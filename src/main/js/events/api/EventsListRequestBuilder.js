import { addDays, format } from 'date-fns';

export function buildEventsListRequestParams(settings, observerLocation, timeZone) {
    return {
        from: format(new Date(), "yyyy-MM-dd"),
        to: format(addDays(new Date(), 3), "yyyy-MM-dd"),
        ...observerLocation,
        timeZone: timeZone,
        rtsSunEnabled: settings.rts.enabled && settings.rts.sunEnabled,
        rtsMoonEnabled: settings.rts.enabled && settings.rts.moonEnabled,
    };
}