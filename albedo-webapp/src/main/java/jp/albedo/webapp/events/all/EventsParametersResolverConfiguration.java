package jp.albedo.webapp.events.all;

import jp.albedo.webapp.controllers.ObserverLocationArgumentResolver;
import jp.albedo.webapp.events.all.parameters.ConjunctionsParametersArgumentResolver;
import jp.albedo.webapp.events.all.parameters.EclipsesParametersArgumentResolver;
import jp.albedo.webapp.events.all.parameters.RtsParametersArgumentResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Component
public class EventsParametersResolverConfiguration implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new RtsParametersArgumentResolver());
        resolvers.add(new ConjunctionsParametersArgumentResolver());
        resolvers.add(new EclipsesParametersArgumentResolver());
    }
}
