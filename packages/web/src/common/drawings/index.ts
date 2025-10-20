import type { AstronomicalCoordinates } from "@astro/coords";

export function calculatePositionAngle(firstBodyCoords: AstronomicalCoordinates, secondBodyCoords: AstronomicalCoordinates): number {
  const firstRaRad = firstBodyCoords.rightAscension / 180 * Math.PI;
  const firstDecRad = firstBodyCoords.declination / 180 * Math.PI;
  const secondRaRad = secondBodyCoords.rightAscension / 180 * Math.PI;
  const secondDecRad = secondBodyCoords.declination / 180 * Math.PI;

  return Math.atan2(
    Math.sin(firstRaRad - secondRaRad),
    Math.cos(secondDecRad) * Math.tan(firstDecRad) - Math.sin(secondDecRad) * Math.cos(firstRaRad - secondRaRad));
}

export function calculateDrawingScale(firstBodyRadiusDeg: number, secondBodyRadiusDeg: number, separation: number, positionAngleRad: number) {
  const longestDimention = (firstBodyRadiusDeg + separation + secondBodyRadiusDeg) * 1.2;
  const scale = 500 / longestDimention;

  const scaleXFactor = Math.sin(positionAngleRad) * scale;
  const scaleYFactor = Math.cos(positionAngleRad) * scale;

  const balance = firstBodyRadiusDeg - secondBodyRadiusDeg;
  const firstBodyBalancedSeparation = (separation - balance) / 2;
  const secondBodyBalancedSeparation = (separation + balance) / 2;

  const firstBodyX = 250 - firstBodyBalancedSeparation * scaleXFactor;
  const firstBodyY = 250 - firstBodyBalancedSeparation * scaleYFactor;
  const secondBodyX = 250 + secondBodyBalancedSeparation * scaleXFactor;
  const secondBodyY = 250 + secondBodyBalancedSeparation * scaleYFactor;

  return { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY }
}
