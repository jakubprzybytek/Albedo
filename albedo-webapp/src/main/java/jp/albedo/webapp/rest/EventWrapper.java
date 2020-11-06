package jp.albedo.webapp.rest;

import jp.albedo.common.JulianDay;
import jp.albedo.webapp.common.JdeEvent;

import java.time.ZoneId;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;

public class EventWrapper {

    public static <T extends JdeEvent> Function<T, WrappedEvent<T>> wrap(AtomicInteger id, ZoneId zoneId) {
        return event -> new WrappedEvent<>(
                id.getAndIncrement(),
                JulianDay.toDateTime(event.getJde()).atZone(ZoneId.of("UTC")).withZoneSameInstant(zoneId),
                event);
    }

}
