import { formatMemorySize } from './Numbers';

describe("Test formatting memory sizes", () => {
    test('for 0 bytes"', () => {
      expect(formatMemorySize(0)).toBe('0 Bytes');
    });

    test('for bytes', () => {
      expect(formatMemorySize(123)).toBe('123.0 Bytes');
    });

    test('for kilobytes', () => {
      expect(formatMemorySize(123456)).toBe('120.6 KB');
    });
    
    test('for megabytes', () => {
      expect(formatMemorySize(123456789)).toBe('117.7 MB');
    });

    test('for gigabytes', () => {
      expect(formatMemorySize(123456789012)).toBe('115.0 GB');
    });
});