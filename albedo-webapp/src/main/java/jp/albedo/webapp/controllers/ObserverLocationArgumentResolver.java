package jp.albedo.webapp.controllers;

import jp.albedo.jeanmeeus.topocentric.GeographicCoordinates;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Optional;

public class ObserverLocationArgumentResolver implements HandlerMethodArgumentResolver {

    public static final String REQUEST_PARAMETER_LONGITUDE = "longitude";
    public static final String REQUEST_PARAMETER_LATITUDE = "latitude";
    public static final String REQUEST_PARAMETER_HEIGHT = "height";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameter().getType() == ObserverLocation.class;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest request, WebDataBinderFactory webDataBinderFactory) throws Exception {
        final double longitudeDegrees = Double.parseDouble(Optional.ofNullable(request.getParameter(REQUEST_PARAMETER_LONGITUDE))
                .orElseThrow(() -> new InvalidApiRequestException("Longitude is missing")));
        final double latitudeDegrees = Double.parseDouble(Optional.ofNullable(request.getParameter(REQUEST_PARAMETER_LATITUDE))
                .orElseThrow(() -> new InvalidApiRequestException("Latitude is missing")));
        final double height = Double.parseDouble(Optional.ofNullable(request.getParameter(REQUEST_PARAMETER_HEIGHT))
                .orElseThrow(() -> new InvalidApiRequestException("Height is missing")));
        return new ObserverLocation(GeographicCoordinates.fromDegrees(longitudeDegrees, latitudeDegrees), height);
    }
}
