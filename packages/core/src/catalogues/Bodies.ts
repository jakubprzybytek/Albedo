import { JplBodyId } from "@jpl";

type BodyInformation = {
  equatorialRadiusKm: number;
  polarRadiusKm: number;
};

export const Bodies = {
  [JplBodyId.Sun]: {
    equatorialRadiusKm: 695700.0,
    polarRadiusKm: 695700.0
  },
  [JplBodyId.Mercury]: {
    equatorialRadiusKm: 2439.7,
    polarRadiusKm: 2439.7
  },
  [JplBodyId.Venus]: {
    equatorialRadiusKm: 6051.8,
    polarRadiusKm: 6051.8
  },
  [JplBodyId.Earth]: {
    equatorialRadiusKm: 6378.1,
    polarRadiusKm: 6356.8
  },
  [JplBodyId.Moon]: {
    equatorialRadiusKm: 1738.1,
    polarRadiusKm: 1736.0
  },
  [JplBodyId.Mars]: {
    equatorialRadiusKm: 3396.2,
    polarRadiusKm: 3376.2
  },
  [JplBodyId.Jupiter]: {
    equatorialRadiusKm: 71492.0,
    polarRadiusKm: 66854.0
  },
  [JplBodyId.Io]: {
    equatorialRadiusKm: 1821.6,
    polarRadiusKm: 1821.6
  },
  [JplBodyId.Europa]: {
    equatorialRadiusKm: 1560.8,
    polarRadiusKm: 1560.8
  },
  [JplBodyId.Ganymede]: {
    equatorialRadiusKm: 2634.1,
    polarRadiusKm: 2634.1
  },
  [JplBodyId.Callisto]: {
    equatorialRadiusKm: 2410.3,
    polarRadiusKm: 2410.3
  },
  [JplBodyId.Saturn]: {
    equatorialRadiusKm: 60268.0,
    polarRadiusKm: 54364.0
  },
  [JplBodyId.Neptune]: {
    equatorialRadiusKm: 24764.0,
    polarRadiusKm: 24341.0
  },
  [JplBodyId.Uranus]: {
    equatorialRadiusKm: 25559,
    polarRadiusKm: 24973.0
  },
  [JplBodyId.Pluto]: {
    equatorialRadiusKm: 1188.3,
    polarRadiusKm: 1188.3
  }
} as const satisfies Partial<Record<JplBodyId, BodyInformation>>;
