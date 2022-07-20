import { BodyType } from './';

export enum JplBodyId {
    SolarSystemBarycenter = 0,

    MercuryBarycenter = 1,
    VenusBarycenter = 2,
    EarthMoonBarycenter = 3,
    MarsBarycenter = 4,
    JupiterBarycenter = 5,
    SaturnBarycenter = 6,
    UranusBarycenter = 7,
    NeptuneBarycenter = 8,
    PlutoBarycenter = 9,

    Sun = 10,

    Mercury = 199,

    Venus = 299,

    Moon = 301,
    Earth = 399,

    Phobos = 401,
    Deimos = 402,
    Mars = 499,

    Io = 501,
    Europa = 502,
    Ganymede = 503,
    Callisto = 504,
    Amalthea = 505,
    Thebe = 514,
    Adrastea = 515,
    Metis = 516,
    Jupiter = 599,

    // Mimas(601, BodyType.NaturalSatellite),
    // Enceladus(602, BodyType.NaturalSatellite),
    // Tethys(603, BodyType.NaturalSatellite),
    // Dione(604, BodyType.NaturalSatellite),
    // Rhea(605, BodyType.NaturalSatellite),
    // Titan(606, BodyType.NaturalSatellite),
    // Hyperion(607, BodyType.NaturalSatellite),
    // Iapetus(608, BodyType.NaturalSatellite),
    // Phoebe(609, BodyType.NaturalSatellite),
    // Helene(612, BodyType.NaturalSatellite),
    // Telesto(613, BodyType.NaturalSatellite),
    // Calypso(614, BodyType.NaturalSatellite),
    // Methone(632, BodyType.NaturalSatellite),
    // Polydeuces(634, BodyType.NaturalSatellite),
    // Saturn(699, BodyType.Planet),

    // Cordelia(706, BodyType.NaturalSatellite),
    // Ophelia(707, BodyType.NaturalSatellite),
    // Bianca(708, BodyType.NaturalSatellite),
    // Cressida(709, BodyType.NaturalSatellite),
    // Desdemona(710, BodyType.NaturalSatellite),
    // Juliet(711, BodyType.NaturalSatellite),
    // Portia(712, BodyType.NaturalSatellite),
    // Rosalind(713, BodyType.NaturalSatellite),
    // Belinda(714, BodyType.NaturalSatellite),
    // Puck(715, BodyType.NaturalSatellite),
    // Perdita(725, BodyType.NaturalSatellite),
    // Mab(726, BodyType.NaturalSatellite),
    // Cupid(727, BodyType.NaturalSatellite),
    // Uranus(799, BodyType.Planet),

    // Triton(801, BodyType.NaturalSatellite),
    // Nereid(802, BodyType.NaturalSatellite),
    // Naid(803, BodyType.NaturalSatellite),
    // Thalassa(804, BodyType.NaturalSatellite),
    // Despina(805, BodyType.NaturalSatellite),
    // Galatea(806, BodyType.NaturalSatellite),
    // Larissa(807, BodyType.NaturalSatellite),
    // Proteus(808, BodyType.NaturalSatellite),
    // Hippocamp(814, BodyType.NaturalSatellite),
    // Neptune(899, BodyType.Planet),

    // Charon(901, BodyType.NaturalSatellite),
    // Nix(902, BodyType.NaturalSatellite),
    // Hydra(903, BodyType.NaturalSatellite),
    // Keberos(904, BodyType.NaturalSatellite),
    // Stys(905, BodyType.NaturalSatellite),
    // Pluto(999, BodyType.Asteroid), // FixMe: should be 'DwarfPlanet'

    // T1000000000(1000000000, BodyType.TimeType),
    // T1000000001(1000000001, BodyType.TimeType);

}

export type JplBody = {
    id: JplBodyId,
    name: string,
    type: BodyType
};

const jplBodies: JplBody[] = [
    { id: JplBodyId.SolarSystemBarycenter, name: 'Solar System Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.MercuryBarycenter, name: 'Mercury Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.VenusBarycenter, name: 'Venus Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.EarthMoonBarycenter, name: 'Earth Moon Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.MarsBarycenter, name: 'Mars Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.JupiterBarycenter, name: 'Jupiter Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.SaturnBarycenter, name: 'Saturn Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.UranusBarycenter, name: 'Uranus Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.NeptuneBarycenter, name: 'Neptune Barycenter', type: BodyType.Barycenter },
    { id: JplBodyId.PlutoBarycenter, name: 'Pluto Barycenter', type: BodyType.Barycenter },

    { id: JplBodyId.Sun, name: 'Sun', type: BodyType.Star },

    { id: JplBodyId.Mercury, name: 'Mercury', type: BodyType.Planet },

    { id: JplBodyId.Venus, name: 'Venus', type: BodyType.Planet },

    { id: JplBodyId.Moon, name: 'Moon', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Earth, name: 'Earth', type: BodyType.Planet },

    { id: JplBodyId.Phobos, name: 'Phobos', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Deimos, name: 'Deimos', type: BodyType.Barycenter },
    { id: JplBodyId.Mars, name: 'Mars', type: BodyType.Planet },

    { id: JplBodyId.Io, name: 'Io', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Europa, name: 'Europa', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Ganymede, name: 'Ganymede', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Callisto, name: 'Callisto', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Amalthea, name: 'Amalthea', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Thebe, name: 'Thebe', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Adrastea, name: 'Adrastea', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Metis, name: 'Metis', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Jupiter, name: 'Jupiter', type: BodyType.Planet }
]

const jplBodiesById = Object.fromEntries(
        jplBodies.map(jplBodyDetails => [jplBodyDetails.id, jplBodyDetails])
    );

const jplBodiesByName = Object.fromEntries(
    jplBodies.map(jplBodyDetails => [jplBodyDetails.name, jplBodyDetails])
);

export function jplBodyFromId(jplBodyId: JplBodyId): JplBody | undefined {
    return jplBodiesById[jplBodyId];
}

export function jplBodyFromString(input: string): JplBody | undefined {
    return jplBodiesByName[input];
}
