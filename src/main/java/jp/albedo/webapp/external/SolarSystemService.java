package jp.albedo.webapp.external;

import jp.albedo.mpc.MPCORBFileLoader;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolarSystemService {

    private static Log LOG = LogFactory.getLog(SolarSystemService.class);

    @Value("${mpcorb.fileName}")
    private String mpcorbFileName;

    private Map<String, BodyRecord> bodyRecordByName;

    public Optional<BodyRecord> getByName(String name) throws IOException {

        if (this.bodyRecordByName == null) {
            this.bodyRecordByName = loadBodyRecords();
        }

        return Optional.ofNullable(this.bodyRecordByName.get(name));
    }

    public List<BodyRecord> getAll() throws IOException {

        if (this.bodyRecordByName == null) {
            this.bodyRecordByName = loadBodyRecords();
        }

        return this.bodyRecordByName.values().stream().collect(Collectors.toList());
    }

    private synchronized Map<String, BodyRecord> loadBodyRecords() throws IOException {

        if (this.bodyRecordByName != null) {
            return this.bodyRecordByName;
        }

        return MPCORBFileLoader.load(new File(this.mpcorbFileName), 1000).stream()
                .collect(Collectors.toMap(
                        mpcorbRecord -> mpcorbRecord.bodyDetails.name,
                        mpcorbRecord -> new BodyRecord(mpcorbRecord.bodyDetails, mpcorbRecord.orbitElements)
                ));
    }

}
