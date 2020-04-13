package jp.albedo.webapp;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonObjectMapperConfiguration implements Jackson2ObjectMapperBuilderCustomizer {

    @Override
    public void customize(Jackson2ObjectMapperBuilder jacksonObjectMapperBuilder) {
        jacksonObjectMapperBuilder.visibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        jacksonObjectMapperBuilder.visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        jacksonObjectMapperBuilder.visibility(PropertyAccessor.CREATOR, JsonAutoDetect.Visibility.ANY);
    }

}
