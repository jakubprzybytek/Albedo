package jp.albedo.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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

    Mars(499, BodyType.Planet),
    Phobos(401, BodyType.NaturalSatellite),
    Deimos(402, BodyType.NaturalSatellite),

    Io(501, BodyType.NaturalSatellite),
    Europa(502, BodyType.NaturalSatellite),
    Ganymede(503, BodyType.NaturalSatellite),
    Callisto(504, BodyType.NaturalSatellite),
    Amalthea(505, BodyType.NaturalSatellite),
    Thebe(514, BodyType.NaturalSatellite),
    Adrastea(515, BodyType.NaturalSatellite),
    Metis(516, BodyType.NaturalSatellite),
    Jupiter(599, BodyType.Planet),

    Saturn(699, BodyType.Planet),
    Uranus(799, BodyType.Planet),
    Neptune(899, BodyType.Planet),
    Pluto(999, BodyType.Asteroid),

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
