package jp.albedo.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Source: https://www.imcce.fr/content/medias/recherche/equipes/asd/calceph/html/c/calceph.naifid.html
 */
public enum JplBody {

    SolarSystemBarycenter(0, BodyType.Barycenter),

    MercuryBarycenter(1, BodyType.Barycenter),
    VenusBarycenter(2, BodyType.Barycenter),
    EarthMoonBarycenter(3, BodyType.Barycenter),
    MarsBarycenter(4, BodyType.Barycenter),
    JupiterBarycenter(5, BodyType.Barycenter),
    SaturnBarycenter(6, BodyType.Barycenter),
    UranusBarycenter(7, BodyType.Barycenter),
    NeptuneBarycenter(8, BodyType.Barycenter),
    PlutoBarycenter(9, BodyType.Barycenter),

    Sun(10, BodyType.Star),

    Mercury(199, BodyType.Planet),

    Venus(299, BodyType.Planet),

    Moon(301, BodyType.NaturalSatellite),
    Earth(399, BodyType.Planet),

    Phobos(401, BodyType.NaturalSatellite),
    Deimos(402, BodyType.NaturalSatellite),
    Mars(499, BodyType.Planet),

    Io(501, BodyType.NaturalSatellite),
    Europa(502, BodyType.NaturalSatellite),
    Ganymede(503, BodyType.NaturalSatellite),
    Callisto(504, BodyType.NaturalSatellite),
    Amalthea(505, BodyType.NaturalSatellite),
    Thebe(514, BodyType.NaturalSatellite),
    Adrastea(515, BodyType.NaturalSatellite),
    Metis(516, BodyType.NaturalSatellite),
    Jupiter(599, BodyType.Planet),

    Mimas(601, BodyType.NaturalSatellite),
    Enceladus(602, BodyType.NaturalSatellite),
    Tethys(603, BodyType.NaturalSatellite),
    Dione(604, BodyType.NaturalSatellite),
    Rhea(605, BodyType.NaturalSatellite),
    Titan(606, BodyType.NaturalSatellite),
    Hyperion(607, BodyType.NaturalSatellite),
    Iapetus(608, BodyType.NaturalSatellite),
    Phoebe(609, BodyType.NaturalSatellite),
    Helene(612, BodyType.NaturalSatellite),
    Telesto(613, BodyType.NaturalSatellite),
    Calypso(614, BodyType.NaturalSatellite),
    Methone(632, BodyType.NaturalSatellite),
    Polydeuces(634, BodyType.NaturalSatellite),
    Saturn(699, BodyType.Planet),

    Cordelia(706, BodyType.NaturalSatellite),
    Ophelia(707, BodyType.NaturalSatellite),
    Bianca(708, BodyType.NaturalSatellite),
    Cressida(709, BodyType.NaturalSatellite),
    Desdemona(710, BodyType.NaturalSatellite),
    Juliet(711, BodyType.NaturalSatellite),
    Portia(712, BodyType.NaturalSatellite),
    Rosalind(713, BodyType.NaturalSatellite),
    Belinda(714, BodyType.NaturalSatellite),
    Puck(715, BodyType.NaturalSatellite),
    Perdita(725, BodyType.NaturalSatellite),
    Mab(726, BodyType.NaturalSatellite),
    Cupid(727, BodyType.NaturalSatellite),
    Uranus(799, BodyType.Planet),

    Triton(801, BodyType.NaturalSatellite),
    Nereid(802, BodyType.NaturalSatellite),
    Naid(803, BodyType.NaturalSatellite),
    Thalassa(804, BodyType.NaturalSatellite),
    Despina(805, BodyType.NaturalSatellite),
    Galatea(806, BodyType.NaturalSatellite),
    Larissa(807, BodyType.NaturalSatellite),
    Proteus(808, BodyType.NaturalSatellite),
    Hippocamp(814, BodyType.NaturalSatellite),
    Neptune(899, BodyType.Planet),

    Charon(901, BodyType.NaturalSatellite),
    Nix(902, BodyType.NaturalSatellite),
    Hydra(903, BodyType.NaturalSatellite),
    Keberos(904, BodyType.NaturalSatellite),
    Stys(905, BodyType.NaturalSatellite),
    Pluto(999, BodyType.Asteroid), // FixMe: should be 'DwarfPlanet'

    T1000000000(1000000000, BodyType.TimeType),
    T1000000001(1000000001, BodyType.TimeType);

    public final int id;

    public final BodyType bodyType;

    private static final Map<Integer, JplBody> lookup = Arrays.stream(JplBody.values())
            .collect(Collectors.toMap(body -> body.id, Function.identity()));

    JplBody(int id, BodyType bodyType) {
        this.id = id;
        this.bodyType = bodyType;
    }

    public static JplBody forId(int id) {
        if (!lookup.containsKey(id)) {
            throw new UnsupportedOperationException("Unknown body id: " + id);
        }

        return lookup.get(id);
    }

    public BodyDetails toBodyDetails() {
        return new BodyDetails(this.name(), bodyType);
    }

}
