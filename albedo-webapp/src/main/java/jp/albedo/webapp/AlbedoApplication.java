package jp.albedo.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "jp.albedo")
public class AlbedoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlbedoApplication.class, args);
    }

}
