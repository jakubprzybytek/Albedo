export * from './Radians';
export * from './RectangularCoordinates';
export * from './AstronomicalCoordinates';

export type ObserverLocation = {
  // Longitude in degrees
  longitude: number;
  // Latitude in degrees
  latitude: number;
  // Altitude in meters
  altitude: number;
}
