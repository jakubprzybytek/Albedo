package jp.albedo.webapp.services;

import jp.albedo.common.BodyType;
import jp.albedo.mpc.CometElsFile;
import jp.albedo.mpc.MPCORBFile;
import jp.albedo.utils.FunctionUtils;
import jp.albedo.webapp.utils.LazyLoadedMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrbitsService {

    @Value("${mpcorb.fileName}")
    private String mpcorbFileName;

    @Value("${cometEls.fileName}")
    private String cometElsFileName;

    private LazyLoadedMap<OrbitingBodyRecord> asteroidOrbits = new LazyLoadedMap<>(
            FunctionUtils.wrapSupplier(this::loadAsteroidOrbits)
    );

    private LazyLoadedMap<OrbitingBodyRecord> cometsOrbits = new LazyLoadedMap<>(
            FunctionUtils.wrapSupplier(this::loadCometOrbits)
    );

    /**
     * Finds and returns orbit details for object which name is provided in parameter.
     *
     * @param name Name of the body to find.
     * @return Optional of orbiting body records.
     */
    public Optional<OrbitingBodyRecord> getByName(String name) {
        final Optional<OrbitingBodyRecord> asteroidOrbitOptional = this.asteroidOrbits.getByName(name);
        return asteroidOrbitOptional.isPresent() ? asteroidOrbitOptional : this.cometsOrbits.getByName(name);
    }

    /**
     * Return orbit details for all known objects.
     *
     * @return List of orbits for all objects that can be loaded by this service.
     */
    public List<OrbitingBodyRecord> getAll(BodyType bodyType) {
        switch (bodyType) {
            case Asteroid:
                return this.asteroidOrbits.getAll();
            case Comet:
                return this.cometsOrbits.getAll();
        }
        throw new RuntimeException("Unknown body type: " + bodyType);
    }

    private Map<String, OrbitingBodyRecord> loadAsteroidOrbits() throws IOException {
        return MPCORBFile.load(new File(this.mpcorbFileName), 2000).stream()
                .collect(Collectors.toMap(
                        mpcorbRecord -> mpcorbRecord.bodyDetails.name,
                        mpcorbRecord -> new OrbitingBodyRecord(mpcorbRecord.bodyDetails, mpcorbRecord.magnitudeParameters, mpcorbRecord.orbitElements)
                ));
    }

    private Map<String, OrbitingBodyRecord> loadCometOrbits() throws IOException {
        return CometElsFile.load(new File(this.cometElsFileName)).stream()
                .collect(Collectors.toMap(
                        mpcorbRecord -> mpcorbRecord.bodyDetails.name,
                        mpcorbRecord -> new OrbitingBodyRecord(mpcorbRecord.bodyDetails, mpcorbRecord.magnitudeParameters, mpcorbRecord.orbitElements)
                ));
    }

}
