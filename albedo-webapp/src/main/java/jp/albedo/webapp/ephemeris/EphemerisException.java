package jp.albedo.webapp.ephemeris;

public class EphemerisException extends Exception {

    public EphemerisException(String message) {
        super(message);
    }

    public EphemerisException(String message, Throwable t) {
        super(message, t);
    }
}
