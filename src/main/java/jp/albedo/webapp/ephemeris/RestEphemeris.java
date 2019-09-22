package jp.albedo.webapp.ephemeris;

import java.time.LocalDateTime;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.Ephemeris;

public class RestEphemeris {

  private LocalDateTime jde;

  private AstronomicalCoordinates coordinates;

  private RestEphemeris(LocalDateTime jde, AstronomicalCoordinates coordinates) {
    this.jde = jde;
    this.coordinates = coordinates;
  }

  public static RestEphemeris fromEphemeris(Ephemeris ephemeris) {
    AstronomicalCoordinates coordsInDegrees = new AstronomicalCoordinates(
        Math.toDegrees(ephemeris.coordinates.rightAscension), Math.toDegrees(ephemeris.coordinates.declination));
    return new RestEphemeris(JulianDay.toDateTime(ephemeris.jde), coordsInDegrees);
  }

  public LocalDateTime getJde() {
    return jde;
  }

  public AstronomicalCoordinates getCoordinates() {
    return coordinates;
  }

}
