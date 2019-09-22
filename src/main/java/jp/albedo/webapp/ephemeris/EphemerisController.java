package jp.albedo.webapp.ephemeris;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.albedo.common.JulianDay;
import jp.albedo.ephemeris.EllipticMotion;
import jp.albedo.mpc.MPCORBFileLoader;
import jp.albedo.mpc.MPCORBRecord;
import jp.albedo.vsop87.VSOPException;

@RestController
public class EphemerisController {

  @RequestMapping(method = RequestMethod.GET, path = "/api/ephemeris")
  public EphemerisResponse ephemeris(@RequestParam(value = "body", defaultValue = "Ceres") String bodyName,
      @RequestParam(value = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
      @RequestParam(value = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
      @RequestParam(value = "interval") double interval) throws IOException, VSOPException {

    final Optional<MPCORBRecord> mpcorbRecordOptional = MPCORBFileLoader
        .find(new File("d:/Workspace/Java/Albedo/misc/MPCORB.DAT"), bodyName);
    final MPCORBRecord mpcorbRecord = mpcorbRecordOptional.get();

    List<Double> JDEs = JulianDay.forRange(JulianDay.fromDateTime(fromDate), JulianDay.fromDateTime(toDate), interval);

    List<RestEphemeris> ephemerisList = EllipticMotion.compute(JDEs, mpcorbRecord.orbitElements).stream()
        .map(RestEphemeris::fromEphemeris).collect(Collectors.toList());

    return new EphemerisResponse(mpcorbRecord.bodyDetails, ephemerisList);
  }

}
