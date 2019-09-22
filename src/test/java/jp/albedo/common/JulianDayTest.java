package jp.albedo.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JulianDayTest {

  @Test
  void fromDate() {
    assertEquals(2436116.31, JulianDay.fromDate(1957, 10, 4.81));
    assertEquals(2448170.5, JulianDay.fromDate(1990, 10, 6.0));
    assertEquals(2448193.04502, JulianDay.fromDate(1990, 10, 28.54502));
  }

  @Test
  void forRange() {
    List<Double> days = JulianDay.forRange(10.0, 45.0, 10.0);
    assertEquals(Arrays.asList(10.0, 20.0, 30.0, 40.0), days);
  }

  @Test
  @DisplayName("Julian day to calendar date test 1")
  void toDateTime1() {
    LocalDateTime dateTime = JulianDay.toDateTime(2436116.31);

    assertEquals(1957, dateTime.getYear());
    assertEquals(10, dateTime.getMonthValue());
    assertEquals(4, dateTime.getDayOfMonth());
    assertEquals(19, dateTime.getHour());
    assertEquals(26, dateTime.getMinute());
    assertEquals(24, dateTime.getSecond());
  }

  @Test
  @DisplayName("Julian day to calendar date test 2")
  void toDateTime2() {
    LocalDateTime dateTime = JulianDay.toDateTime(1842713.0);

    assertEquals(333, dateTime.getYear());
    assertEquals(1, dateTime.getMonthValue());
    assertEquals(27, dateTime.getDayOfMonth());
    assertEquals(12, dateTime.getHour());
    assertEquals(0, dateTime.getMinute());
    assertEquals(0, dateTime.getSecond());
  }

  @Test
  @DisplayName("Julian day to calendar date test 3")
  void toDateTime3() {
    LocalDateTime dateTime = JulianDay.toDateTime(1507900.13);

    assertEquals(-584, dateTime.getYear());
    assertEquals(5, dateTime.getMonthValue());
    assertEquals(28, dateTime.getDayOfMonth());
    assertEquals(15, dateTime.getHour());
    assertEquals(7, dateTime.getMinute());
    assertEquals(12, dateTime.getSecond());
  }
}