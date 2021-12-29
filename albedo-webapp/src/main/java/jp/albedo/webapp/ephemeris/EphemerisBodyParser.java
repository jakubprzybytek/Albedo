package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;

import java.util.Optional;

public interface EphemerisBodyParser {

    Optional<BodyDetails> parse(String bodyName);

}
