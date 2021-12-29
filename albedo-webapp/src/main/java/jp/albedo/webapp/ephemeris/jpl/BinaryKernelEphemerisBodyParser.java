package jp.albedo.webapp.ephemeris.jpl;

import jp.albedo.common.BodyDetails;
import jp.albedo.common.BodyType;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.webapp.ephemeris.EphemerisBodyParser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class BinaryKernelEphemerisBodyParser implements EphemerisBodyParser {

    private static final Log LOG = LogFactory.getLog(BinaryKernelEphemerisBodyParser.class);

    private boolean supportedBodiesInitialised = false;

    private List<JplBody> supportedPlanets;

    private List<JplBody> supportedNaturalSatellites;

    private final SpkKernelRepository kernelRepository;

    public BinaryKernelEphemerisBodyParser(SpkKernelRepository kernelRepository) {
        this.kernelRepository = kernelRepository;
    }

    @Override
    public Optional<BodyDetails> parse(String bodyName) {
        if (!supportedBodiesInitialised) {
            loadSupportedBodies();
        }

        return Stream.concat(supportedPlanets.stream(), supportedNaturalSatellites.stream())
                .filter(jplBody -> jplBody.name().equals(bodyName))
                .findFirst()
                .map(jplBody -> new BodyDetails(jplBody.name(), jplBody.bodyType));
    }

    private void loadSupportedBodies() {
        supportedNaturalSatellites = kernelRepository.registeredBodiesStream()
                .filter(jplBody -> BodyType.NaturalSatellite == jplBody.bodyType)
                .collect(Collectors.toList());

        supportedPlanets = kernelRepository.registeredBodiesStream()
                .filter(jplBody -> BodyType.Planet == jplBody.bodyType)
                .filter(jplBody -> JplBody.Earth != jplBody)
                .collect(Collectors.toList());

        supportedBodiesInitialised = true;
    }

}
