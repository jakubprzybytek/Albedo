package jp.albedo.webapp.ephemeris;

import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.mpc.MPCORBRecord;
import jp.albedo.sandbox.EphemerisOrchestrator;
import jp.albedo.vsop87.VSOPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class EphemerisController {

    @Autowired
    private EphemerisOrchestrator ephemerisOrchestrator;

    @RequestMapping(method = RequestMethod.GET, path = "/api/ephemeris")
    public EphemerisResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
                                       @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                       @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
                                       @RequestParam(value = "interval") double interval) throws IOException, VSOPException {

        final Optional<MPCORBRecord> mpcorbRecordOptional = MPCORBFileLoader.find(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), bodyName);
        final MPCORBRecord mpcorbRecord = mpcorbRecordOptional.get();

        List<RestEphemeris> ephemerisList = this.ephemerisOrchestrator.compute(mpcorbRecord.orbitElements, fromDate, toDate, interval)
                .stream()
                .map(RestEphemeris::fromEphemeris)
                .collect(Collectors.toList());

        return new EphemerisResponse(mpcorbRecord.bodyDetails, ephemerisList);
    }

}
