import { describe, it, expect } from "vitest";
import { geodeticToRectangular } from '../Geodetic';
import { Radians } from "@math";

describe('geodeticToRectangular', () => {
    describe('input validation', () => {
        it('should throw error for equatorial radius <= 0', () => {
            expect(() => {
                geodeticToRectangular(0, 0, 0, 0, 0.1);
            }).toThrow('Equatorial radius must be greater than zero');

            expect(() => {
                geodeticToRectangular(0, 0, 0, -1, 0.1);
            }).toThrow('Equatorial radius must be greater than zero');
        });

        it('should throw error for flattening >= 1', () => {
            expect(() => {
                geodeticToRectangular(0, 0, 0, 6378.2064, 1.0);
            }).toThrow('Flattening coefficient must be less than 1');

            expect(() => {
                geodeticToRectangular(0, 0, 0, 6378.2064, 1.5);
            }).toThrow('Flattening coefficient must be less than 1');
        });
    });

    describe('Example 1: Earth coordinates with PCK data', () => {
        const earthEquatorialRadius = 6378.1366;
        const earthPolarRadius = 6356.7519;
        const earthFlattening = (earthEquatorialRadius - earthPolarRadius) / earthEquatorialRadius;

        it('should convert geodetic coordinates (118°, 30°, 0 km) correctly', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(118.0), Radians.fromDegrees(30.0), 0.0, earthEquatorialRadius, earthFlattening);
            expect(result.x).approximately(-2595.359, 1);
            expect(result.y).approximately(4881.161, 1);
            expect(result.z).approximately(3170.374, 1);
        });
    });

    describe('Example 2: Clark 66 spheroid test cases', () => {
        const clarkRadius = 6378.2064;
        const clarkFlattening = 1.0 / 294.9787;

        it('should handle north pole with negative altitude (center of Earth)', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(0), Radians.fromDegrees(90), -6356.584, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle equator at prime meridian', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(0), Radians.fromDegrees(0), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(6378.206, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle equator at 90° longitude', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(90), Radians.fromDegrees(0), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(6378.206, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle north pole at surface', () => {
            const result = geodeticToRectangular(   Radians.fromDegrees(0), Radians.fromDegrees(90), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(6356.584, 0.001);
        });

        it('should handle equator at 180° longitude (antimeridian)', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(180), Radians.fromDegrees(0), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(-6378.206, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle equator at -90° longitude', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(-90), Radians.fromDegrees(0), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(-6378.206, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle south pole at surface', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(0), Radians.fromDegrees(-90), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(-6356.584, 0.001);
        });

        it('should handle 45° longitude at equator', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(45), Radians.fromDegrees(0), 0, clarkRadius, clarkFlattening);
            expect(result.x).approximately(4510.073, 0.001);
            expect(result.y).approximately(4510.073, 0.001);
            expect(result.z).approximately(0, 0.001);
        });

        it('should handle near north pole at prime meridian', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(0), Radians.fromDegrees(88.707), -6355.573, clarkRadius, clarkFlattening);
            expect(result.x).approximately(1, 0.001);
            expect(result.y).approximately(0, 0.001);
            expect(result.z).approximately(1, 0.001);
        });

        it('should handle near north pole at 90° longitude', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(90), Radians.fromDegrees(88.707), -6355.573, clarkRadius, clarkFlattening);
            expect(result.x).approximately(0, 0.001);
            expect(result.y).approximately(1, 0.001);
            expect(result.z).approximately(1, 0.001);
        });

        it('should handle near north pole at 45° longitude', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(45), Radians.fromDegrees(88.171), -6355.561, clarkRadius, clarkFlattening);
            expect(result.x).approximately(1, 0.001);
            expect(result.y).approximately(1, 0.001);
            expect(result.z).approximately(1, 0.001);
        });
    });

    describe('edge cases', () => {
        const radius = 6378.2064;
        const flattening = 1.0 / 294.9787;

        it('should handle north pole', () => {
            const result = geodeticToRectangular(0, Math.PI / 2, 0, radius, flattening);
            expect(result.x).approximately(0, 1e-6);
            expect(result.y).approximately(0, 1e-6);
            expect(result.z).approximately(radius * (1 - flattening), 1e-6); // polar radius
        });

        it('should handle south pole', () => {
            const result = geodeticToRectangular(0, -Math.PI / 2, 0, radius, flattening);
            expect(result.x).approximately(0, 1e-6);
            expect(result.y).approximately(0, 1e-6);
            expect(result.z).approximately(-radius * (1 - flattening), 1e-6); // negative polar radius
        });

        it('should handle equator at prime meridian', () => {
            const result = geodeticToRectangular(0, 0, 0, radius, flattening);
            expect(result.x).approximately(radius, 1e-6);
            expect(result.y).approximately(0, 1e-6);
            expect(result.z).approximately(0, 1e-6);
        });

        it('should handle equator at 90° longitude', () => {
            const result = geodeticToRectangular(Math.PI / 2, 0, 0, radius, flattening);
            expect(result.x).approximately(0, 1e-6);
            expect(result.y).approximately(radius, 1e-6);
            expect(result.z).approximately(0, 1e-6);
        });

        it('should handle negative altitude', () => {
            const result = geodeticToRectangular(0, 0, -1000, radius, flattening);
            // Should be closer to Earth center
            expect(result.x).toBeLessThan(radius);
            expect(result.y).toEqual(0);
            expect(result.z).toEqual(0);
        });

        it('should handle positive altitude', () => {
            const result = geodeticToRectangular(0, 0, 1000, radius, flattening);
            // Should be farther from Earth center
            expect(result.x).toBeGreaterThan(radius);
            expect(result.y).toEqual(0);
            expect(result.z).toEqual(0);
        });

        it('should handle zero flattening (perfect sphere)', () => {
            const result = geodeticToRectangular(Radians.fromDegrees(45), Radians.fromDegrees(45), 0, radius, 0);
            const expectedDistance = radius;
            const actualDistance = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
            expect(actualDistance).approximately(expectedDistance, 1e-9);
        });
    });

    describe('mathematical properties', () => {
        const radius = 6378.2064;
        const flattening = 1.0 / 294.9787;

        it('should maintain symmetry for longitude', () => {
            const lat = Radians.fromDegrees(30);
            const alt = 1000;
            
            const result1 = geodeticToRectangular(Radians.fromDegrees(45), lat, alt, radius, flattening);
            const result2 = geodeticToRectangular(Radians.fromDegrees(-45), lat, alt, radius, flattening);
            
            expect(result1.x).approximately(result2.x, 1e-6);
            expect(result1.y).approximately(-result2.y, 1e-6);
            expect(result1.z).approximately(result2.z, 1e-6);
        });

        it('should maintain symmetry for latitude', () => {
            const lon = Radians.fromDegrees(45);
            const alt = 1000;
            
            const result1 = geodeticToRectangular(lon, Radians.fromDegrees(30), alt, radius, flattening);
            const result2 = geodeticToRectangular(lon, Radians.fromDegrees(-30), alt, radius, flattening);
            
            expect(result1.x).approximately(result2.x, 1e-6);
            expect(result1.y).approximately(result2.y, 1e-6);
            expect(result1.z).approximately(-result2.z, 1e-6);
        });
    });
});
