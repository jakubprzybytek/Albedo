import { scaleFactory } from './VisibilityChart';

test('Scales for UTC time zone', () => {
    const scale = scaleFactory('2020-05-14T20:39:07', 0, 1, 0);
    expect(scale('2020-05-14T12:01:07')).toStrictEqual([1, 0]);
    expect(scale('2020-05-14T23:59:07')).toStrictEqual([719, 0]);
    expect(scale('2020-05-15T00:00:46')).toStrictEqual([720, 0]);
    expect(scale('2020-05-15T01:00:46')).toStrictEqual([780, 0]);
    expect(scale('2020-05-15T12:00:46')).toStrictEqual([1440, 0]);

    expect(scale('2020-05-16T23:59:07')).toStrictEqual([719, 2]);
    expect(scale('2020-05-17T00:01:46')).toStrictEqual([721, 2]);
  });