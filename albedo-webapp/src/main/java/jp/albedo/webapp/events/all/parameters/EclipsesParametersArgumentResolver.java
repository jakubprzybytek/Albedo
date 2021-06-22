package jp.albedo.webapp.events.all.parameters;

import jp.albedo.webapp.controllers.HttpParameter;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class EclipsesParametersArgumentResolver implements HandlerMethodArgumentResolver {

    public static final String REQUEST_PARAMETER_ENABLED = "eclipsesEnabled";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameter().getType() == EclipsesParameters.class;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest request, WebDataBinderFactory webDataBinderFactory) throws Exception {
        final boolean enabled = HttpParameter.getBoolean(request, REQUEST_PARAMETER_ENABLED);

        return new EclipsesParameters(enabled);
    }
}
