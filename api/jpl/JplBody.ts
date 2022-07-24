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

    Mimas = 601,
    Enceladus = 602,
    Tethys = 603,
    Dione = 604,
    Rhea = 605,
    Titan = 606,
    Hyperion = 607,
    Iapetus = 608,
    Phoebe = 609,
    Helene = 612,
    Telesto = 613,
    Calypso = 614,
    Methone = 632,
    Polydeuces = 634,
    Saturn = 699,

    Cordelia = 706,
    Ophelia = 707,
    Bianca = 708,
    Cressida = 709,
    Desdemona = 710,
    Juliet = 711,
    Portia = 712,
    Rosalind = 713,
    Belinda = 714,
    Puck = 715,
    Caliban = 716,
    Sycorax = 717,
    Prospero = 718,
    Setebos = 719,
    Stephano = 720,
    Trinculo = 721,
    Francisco = 722,
    Margaret = 723,
    Ferdinand = 724,
    Perdita = 725,
    Mab = 726,
    Cupid = 727,
    Uranus = 799,

    Triton = 801,
    Nereid = 802,
    Naid = 803,
    Thalassa = 804,
    Despina = 805,
    Galatea = 806,
    Larissa = 807,
    Proteus = 808,
    Halimede = 809,
    Psamathe = 810,
    Sao = 811,
    Laomedeia = 812,
    Neso = 813,
    Hippocamp = 814,
    Neptune = 899,

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
    { id: JplBodyId.Jupiter, name: 'Jupiter', type: BodyType.Planet },

    { id: JplBodyId.Mimas, name: 'Mimas', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Enceladus, name: 'Enceladus', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Tethys, name: 'Tethys', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Dione, name: 'Dione', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Rhea, name: 'Rhea', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Titan, name: 'Titan', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Hyperion, name: 'Hyperion', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Iapetus, name: 'Iapetus', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Phoebe, name: 'Phoebe', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Helene, name: 'Helene', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Telesto, name: 'Telesto', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Calypso, name: 'Calypso', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Methone, name: 'Methone', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Polydeuces, name: 'Polydeuces', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Saturn, name: 'Saturn', type: BodyType.Planet },

    { id: JplBodyId.Cordelia, name: 'Cordelia', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Ophelia, name: 'Ophelia', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Bianca, name: 'Bianca', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Cressida, name: 'Cressida', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Desdemona, name: 'Desdemona', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Juliet, name: 'Juliet', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Portia, name: 'Portia', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Rosalind, name: 'Rosalind', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Belinda, name: 'Belinda', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Puck, name: 'Puck', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Caliban, name: 'Caliban', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Sycorax, name: 'Sycorax', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Prospero, name: 'Prospero', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Setebos, name: 'Setebos', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Stephano, name: 'Stephano', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Trinculo, name: 'Trinculo', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Francisco, name: 'Francisco', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Margaret, name: 'Margaret', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Ferdinand, name: 'Ferdinand', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Perdita, name: 'Perdita', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Mab, name: 'Mab', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Cupid, name: 'Cupid', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Uranus, name: 'Uranus', type: BodyType.Planet },

    { id: JplBodyId.Triton, name: 'Triton', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Nereid, name: 'Nereid', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Naid, name: 'Naid', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Thalassa, name: 'Thalassa', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Despina, name: 'Despina', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Galatea, name: 'Galatea', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Larissa, name: 'Larissa', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Proteus, name: 'Proteus', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Halimede, name: 'Halimede', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Psamathe, name: 'Psamathe', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Sao, name: 'Sao', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Laomedeia, name: 'Laomedeia', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Neso, name: 'Neso', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Hippocamp, name: 'Hippocamp', type: BodyType.NaturalSatellite },
    { id: JplBodyId.Neptune, name: 'Neptune', type: BodyType.Planet },
]

const jplBodiesById = Object.fromEntries(
    jplBodies.map(jplBodyDetails => [jplBodyDetails.id, jplBodyDetails])
);

const jplBodiesByName = Object.fromEntries(
    jplBodies.map(jplBodyDetails => [jplBodyDetails.name, jplBodyDetails])
);

export function jplBodyFromId(jplBodyId: JplBodyId): JplBody | undefined {
    return jplBodiesById[jplBodyId] || {
        id: jplBodyId,
        name: `unknown(${jplBodyId})`,
        type: BodyType.Unknown
    };
}

export function jplBodyFromString(input: string): JplBody | undefined {
    return jplBodiesByName[input];
}
