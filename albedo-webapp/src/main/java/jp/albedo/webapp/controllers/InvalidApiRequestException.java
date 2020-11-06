package jp.albedo.webapp.controllers;

public class InvalidApiRequestException extends Exception {

    public InvalidApiRequestException(String message) {
        super(message);
    }
}
