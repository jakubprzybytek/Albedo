package jp.albedo.jpl;

public class JplException extends Exception {

    public JplException(String message) {
        super(message);
    }

    public JplException(String message, Throwable e) {
        super(message, e);
    }

}
