package jp.albedo.webapp.events.all.parameters;

import jp.albedo.webapp.controllers.HttpParameter;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class ConjunctionsParametersArgumentResolver implements HandlerMethodArgumentResolver {

    public static final String REQUEST_PARAMETER_SUN_ENABLED = "conjunctionsSunEnabled";
    public static final String REQUEST_PARAMETER_MOON_ENABLED = "conjunctionsMoonEnabled";
    public static final String REQUEST_PARAMETER_PLANETS_ENABLED = "conjunctionsPlanetsEnabled";
    public static final String REQUEST_PARAMETER_COMETS_ENABLED = "conjunctionsCometsEnabled";
    public static final String REQUEST_PARAMETER_ASTEROIDS_ENABLED = "conjunctionsAsteroidsEnabled";
    public static final String REQUEST_PARAMETER_CATALOGUES_ENABLED = "conjunctionsCataloguesDSEnabled";
    public static final String REQUEST_PARAMETER_FILTER_BLINDED_BY_SUN = "cFilterBlindedBySun";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameter().getType() == ConjunctionsParameters.class;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest request, WebDataBinderFactory webDataBinderFactory) throws Exception {
        final boolean sunEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_SUN_ENABLED);
        final boolean moonEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_MOON_ENABLED);
        final boolean planetsEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_PLANETS_ENABLED);
        final boolean cometsEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_COMETS_ENABLED);
        final boolean asteroidsEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_ASTEROIDS_ENABLED);
        final boolean cataloguesEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_CATALOGUES_ENABLED);
        final boolean filterBlindedBySun = HttpParameter.getBoolean(request, REQUEST_PARAMETER_FILTER_BLINDED_BY_SUN);

        return new ConjunctionsParameters(sunEnabled, moonEnabled, planetsEnabled, cometsEnabled, asteroidsEnabled, cataloguesEnabled, filterBlindedBySun);
    }
}
