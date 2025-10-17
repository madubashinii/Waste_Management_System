package com.csse.ecocollectbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EcoCollectBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcoCollectBackendApplication.class, args);
    }

}
