import { JplBodyId } from "@jpl";
import { geodeticToRectangular } from "@jpl/coordinates/Geodetic";
import { BodyGeometryProvider } from "@jpl/kernels/pck";

export class ParalaxCorrection {
  constructor(readonly bodyGeometryProvider: BodyGeometryProvider) {
  }

  observerPosition(longitude: number, latitude: number, altitude: number) {
    const bodyGeometry = this.bodyGeometryProvider.getBodyRadii(JplBodyId.Earth);

    if (bodyGeometry === undefined) {
      throw Error("Earth geometry not found for Earth");
    }

    const bodyRadius = bodyGeometry[0];
    const bodyFlattening = bodyGeometry[1];

    const bodyFixedObserverPosition = geodeticToRectangular(longitude, latitude, altitude, bodyRadius, bodyFlattening);
  }
}
