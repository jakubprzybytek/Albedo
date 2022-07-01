import { BodyType } from './';

enum JplBodyName {
    SolarSystemBarycenter,
    MercuryBarycenter,
    VenusBarycenter
};

type JplBodyDetauks = {
    name: JplBodyName,
    id: number,
    type: BodyType
};

const JplBody2 = {
    
};

export class JplBody {

    readonly id: number;
    readonly type: BodyType;

    constructor(id: number, type: BodyType) {
        this.id = id;
        this.type = type;
    }

    public static readonly SolarSystemBarycenter = new JplBody(0, BodyType.Barycenter);

    public static readonly MercuryBarycenter = new JplBody(1, BodyType.Barycenter);
    public static readonly VenusBarycenter = new JplBody(2, BodyType.Barycenter);
    public static readonly EarthMoonBarycenter = new JplBody(3, BodyType.Barycenter);
    public static readonly MarsBarycenter = new JplBody(4, BodyType.Barycenter);
    public static readonly JupiterBarycenter = new JplBody(5, BodyType.Barycenter);
    public static readonly SaturnBarycenter = new JplBody(6, BodyType.Barycenter);
    public static readonly UranusBarycenter = new JplBody(7, BodyType.Barycenter);
    public static readonly NeptuneBarycenter = new JplBody(8, BodyType.Barycenter);
    public static readonly PlutoBarycenter = new JplBody(9, BodyType.Barycenter);

    public static readonly Sun = new JplBody(10, BodyType.Star);

    public static readonly Mercury = new JplBody(199, BodyType.Planet);

    // Venus(299, BodyType.Planet),

    // Moon(301, BodyType.NaturalSatellite),
    public static readonly Earth = new JplBody(399, BodyType.Planet);

    public static readonly Phobos = new JplBody(401, BodyType.NaturalSatellite);
    public static readonly Deimos = new JplBody(402, BodyType.NaturalSatellite);
    public static readonly Mars = new JplBody(499, BodyType.Planet);

    // Io(501, BodyType.NaturalSatellite),
    // Europa(502, BodyType.NaturalSatellite),
    // Ganymede(503, BodyType.NaturalSatellite),
    // Callisto(504, BodyType.NaturalSatellite),
    // Amalthea(505, BodyType.NaturalSatellite),
    // Thebe(514, BodyType.NaturalSatellite),
    // Adrastea(515, BodyType.NaturalSatellite),
    // Metis(516, BodyType.NaturalSatellite),
    // Jupiter(599, BodyType.Planet),

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

    // public static JplBody forId(int id) {
    //     if (!lookup.containsKey(id)) {
    //         throw new UnsupportedOperationException("Unknown body id: " + id);
    //     }

    //     return lookup.get(id);
    // }

    // public BodyDetails toBodyDetails() {
    //     return new BodyDetails(this.name(), bodyType);
    // }

    public toString = () : string => {
        return `(${this.id})`;
    }
}
