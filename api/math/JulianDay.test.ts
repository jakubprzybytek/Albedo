import { describe, it, expect } from "vitest";
import { JulianDay } from './';

describe("JulianDay", () => {
    it("should correctly compute from date", () => {
        expect(JulianDay.fromDate(1990, 10, 6)).toBe(2448170.5);
        expect(JulianDay.fromDate(1957, 10, 4.81)).toBe(2436116.31);
        expect(JulianDay.fromDate(1990, 10, 28.54502)).toBe(2448193.04502);
        expect(JulianDay.fromDate(2650, 0, 25)).toBe(2688945.5);
    });

    it("should correctly compute from date object", () => {
        expect(JulianDay.fromDateObject(new Date('1990-10-06'))).toBe(2448170.5);
    });

    it("should generate ranges", () => {
        expect(JulianDay.forRange(10, 13.4, 1.5)).toEqual([10, 11.5, 13]);
    });
});


// class JulianDayTest {

//     @Test
//     @DisplayName("Julian day to calendar date test 1")
//     void toDateTime1() {
//         LocalDateTime dateTime = JulianDay.toDateTime(2436116.31);

//         assertEquals(1957, dateTime.getYear());
//         assertEquals(10, dateTime.getMonthValue());
//         assertEquals(4, dateTime.getDayOfMonth());
//         assertEquals(19, dateTime.getHour());
//         assertEquals(26, dateTime.getMinute());
//         assertEquals(24, dateTime.getSecond());
//     }

//     @Test
//     @DisplayName("Julian day to calendar date test 2")
//     void toDateTime2() {
//         LocalDateTime dateTime = JulianDay.toDateTime(1842713.0);

//         assertEquals(333, dateTime.getYear());
//         assertEquals(1, dateTime.getMonthValue());
//         assertEquals(27, dateTime.getDayOfMonth());
//         assertEquals(12, dateTime.getHour());
//         assertEquals(0, dateTime.getMinute());
//         assertEquals(0, dateTime.getSecond());
//     }

//     @Test
//     @DisplayName("Julian day to calendar date test 3")
//     void toDateTime3() {
//         LocalDateTime dateTime = JulianDay.toDateTime(1507900.13);

//         assertEquals(-584, dateTime.getYear());
//         assertEquals(5, dateTime.getMonthValue());
//         assertEquals(28, dateTime.getDayOfMonth());
//         assertEquals(15, dateTime.getHour());
//         assertEquals(7, dateTime.getMinute());
//         assertEquals(12, dateTime.getSecond());
//     }

//     @Test
//     @DisplayName("Julian day to calendar date test 4")
//     void toDateTime4() {
//         LocalDateTime dateTime = JulianDay.toDateTime(2458813.740272218);

//         assertEquals(2019, dateTime.getYear());
//         assertEquals(11, dateTime.getMonthValue());
//         assertEquals(26, dateTime.getDayOfMonth());
//         assertEquals(5, dateTime.getHour());
//         assertEquals(46, dateTime.getMinute());
//         assertEquals(0, dateTime.getSecond());
//     }

//     @Test
//     @DisplayName("Parse gregorian data as string and convert to Julian day")
//     void parseLocalDateString() {
//         assertThat(JulianDay.fromDate(LocalDate.parse("1990-10-06"))).isEqualTo(2448170.5);
//     }

// }