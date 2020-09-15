import { scaleFactory, arrangeDatesFactory } from './VisibilityChart';

  test('Arranging dates for UTC time zone', () => {
    const arrangeDates = arrangeDatesFactory('2020-05-14T20:39:07', 0);
    const dates = [
      '2020-05-14T12:01:07',
      '2020-05-14T23:59:07',
      '2020-05-15T00:00:46',
      '2020-05-15T01:00:46',
      '2020-05-15T12:00:46',
      '2020-05-16T23:59:07',
      '2020-05-17T00:01:46'
    ];

    expect(arrangeDates(dates)).toStrictEqual([
      [1, 0],
      [719, 0],
      [720, 0],
      [780, 0],
      [1440, 0],
      [719, 2],
      [721, 2]
    ]);
  });
