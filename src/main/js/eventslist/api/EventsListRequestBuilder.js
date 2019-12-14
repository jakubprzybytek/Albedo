import { addDays, format } from 'date-fns';

export function buildEventsListRequestParams(store) {
    return {
        from: format(new Date(), "yyyy-MM-dd"),
        to: format(addDays(new Date(), 3), "yyyy-MM-dd"),
        ...store.observerLocation,
        timeZone: store.timeZone,
        rtsSunEnabled: store.rtsSettings.rtsEnabled && store.rtsSettings.rtsSunEnabled,
        rtsMoonEnabled: store.rtsSettings.rtsEnabled && store.rtsSettings.rtsMoonEnabled,
    };
}