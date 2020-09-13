package jp.albedo.webapp.charts.visibility;

import java.time.LocalDateTime;

public class SunEvents {

    final private LocalDateTime setting;

    final private LocalDateTime civilDusk;

    final private LocalDateTime nauticalDusk;

    final private LocalDateTime astronomicalDusk;

    final private LocalDateTime astonomicalDown;

    final private LocalDateTime nauticalDown;

    final private LocalDateTime civilDown;

    final private LocalDateTime rising;

    public SunEvents(LocalDateTime setting, LocalDateTime civilDusk, LocalDateTime nauticalDusk, LocalDateTime astronomicalDusk, LocalDateTime astonomicalDown, LocalDateTime nauticalDown, LocalDateTime civilDown, LocalDateTime rising) {
        this.setting = setting;
        this.civilDusk = civilDusk;
        this.nauticalDusk = nauticalDusk;
        this.astronomicalDusk = astronomicalDusk;
        this.astonomicalDown = astonomicalDown;
        this.nauticalDown = nauticalDown;
        this.civilDown = civilDown;
        this.rising = rising;
    }
}
