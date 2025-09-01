import { RectangularCoordinates } from "@astro/coords";

/**
 * Converts geodetic coordinates to rectangular coordinates.
 * 
 * This function converts geodetic coordinates (longitude, latitude, altitude)
 * to rectangular coordinates using an ellipsoidal Earth model.
 * 
 * @param longitude - Geodetic longitude in radians. Angle between prime meridian
 *                   and the meridian containing the point. Positive direction is
 *                   from +X axis towards +Y axis.
 * @param latitude - Geodetic latitude in radians. For a point on the reference
 *                  spheroid, this is the angle between the XY plane and the
 *                  outward normal vector at the point.
 * @param altitude - Altitude of point above the reference spheroid in same units as radii
 * @param equatorialRadius - Equatorial radius of the reference spheroid (must be > 0)
 * @param flattening - Flattening coefficient (must be < 1)
 * @returns Object containing rectangular coordinates {x, y, z}
 * @throws Error if equatorial radius <= 0 or flattening >= 1
 */
export function geodeticToRectangular(
    longitude: number,
    latitude: number,
    altitude: number,
    equatorialRadius: number,
    flattening: number
): RectangularCoordinates {
    // Input validation
    if (equatorialRadius <= 0) {
        throw new Error(`Equatorial radius must be greater than zero. Got: ${equatorialRadius}`);
    }

    if (flattening >= 1) {
        throw new Error(`Flattening coefficient must be less than 1. Got: ${flattening}`);
    }

    // Compute the polar radius of the spheroid
    const polarRadius = equatorialRadius - flattening * equatorialRadius;

    // Precompute trigonometric values
    const cosPhi = Math.cos(latitude);
    const sinPhi = Math.sin(latitude);
    const cosLambda = Math.cos(longitude);
    const sinLambda = Math.sin(longitude);

    // Compute scale factor for finding rectangular coordinates
    // of a point with altitude 0 but same geodetic lat/lon
    const big = Math.max(
        Math.abs(equatorialRadius * cosPhi),
        Math.abs(polarRadius * sinPhi)
    );

    const x = equatorialRadius * cosPhi / big;
    const y = polarRadius * sinPhi / big;
    const scale = 1.0 / (big * Math.sqrt(x * x + y * y));

    // Compute rectangular coordinates of the point with zero altitude
    const baseX = scale * equatorialRadius * equatorialRadius * cosLambda * cosPhi;
    const baseY = scale * equatorialRadius * equatorialRadius * sinLambda * cosPhi;
    const baseZ = scale * polarRadius * polarRadius * sinPhi;

    // Compute the outward unit normal to the ellipsoid at the base point
    const normalX = baseX / (equatorialRadius * equatorialRadius);
    const normalY = baseY / (equatorialRadius * equatorialRadius);
    const normalZ = baseZ / (polarRadius * polarRadius);

    // Normalize the normal vector
    const normalMagnitude = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
    const unitNormalX = normalX / normalMagnitude;
    const unitNormalY = normalY / normalMagnitude;
    const unitNormalZ = normalZ / normalMagnitude;

    // Move along the normal to the input point (add altitude)
    const rectX = baseX + altitude * unitNormalX;
    const rectY = baseY + altitude * unitNormalY;
    const rectZ = baseZ + altitude * unitNormalZ;

    return new RectangularCoordinates(rectX, rectY, rectZ);
}
