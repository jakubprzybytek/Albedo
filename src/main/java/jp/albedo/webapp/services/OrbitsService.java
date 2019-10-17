package jp.albedo.webapp.services;

import jp.albedo.mpc.MPCORBFileLoader;
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

    private Map<String, OrbitingBodyRecord> bodyRecordByName;

    public Optional<OrbitingBodyRecord> getByName(String name) throws IOException {

        if (this.bodyRecordByName == null) {
            this.bodyRecordByName = loadBodyRecords();
        }

        return Optional.ofNullable(this.bodyRecordByName.get(name));
    }

    public List<OrbitingBodyRecord> getAll() throws IOException {

        if (this.bodyRecordByName == null) {
            this.bodyRecordByName = loadBodyRecords();
        }

        return this.bodyRecordByName.values().stream().collect(Collectors.toList());
    }

    private synchronized Map<String, OrbitingBodyRecord> loadBodyRecords() throws IOException {

        if (this.bodyRecordByName != null) {
            return this.bodyRecordByName;
        }

        return MPCORBFileLoader.load(new File(this.mpcorbFileName), 1000).stream()
                .collect(Collectors.toMap(
                        mpcorbRecord -> mpcorbRecord.bodyDetails.name,
                        mpcorbRecord -> new OrbitingBodyRecord(mpcorbRecord.bodyDetails, mpcorbRecord.magnitudeParameters, mpcorbRecord.orbitElements)
                ));
    }

}
