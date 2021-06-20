package jp.albedo.webapp.controllers;

import jp.albedo.webapp.events.all.parameters.ConjunctionsParametersArgumentResolver;
import jp.albedo.webapp.events.all.parameters.RtsParametersArgumentResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Component
public class ArgumentResolverConfiguration implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new ObserverLocationArgumentResolver());
        resolvers.add(new RtsParametersArgumentResolver());
        resolvers.add(new ConjunctionsParametersArgumentResolver());
    }
}
