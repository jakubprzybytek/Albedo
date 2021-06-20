package jp.albedo.webapp.events.all.parameters;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class RtsParametersArgumentResolver implements HandlerMethodArgumentResolver {

    public static final String REQUEST_PARAMETER_SUN_ENABLED = "rtsSunEnabled";
    public static final String REQUEST_PARAMETER_MOON_ENABLED = "rtsMoonEnabled";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameter().getType() == RtsParameters.class;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest request, WebDataBinderFactory webDataBinderFactory) throws Exception {
        final boolean sunEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_SUN_ENABLED);
        final boolean moonEnabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_MOON_ENABLED);

        return new RtsParameters(sunEnabled, moonEnabled);
    }
}
