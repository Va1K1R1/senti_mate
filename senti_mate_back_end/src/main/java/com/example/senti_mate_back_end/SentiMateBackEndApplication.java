package com.example.senti_mate_back_end;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SentiMateBackEndApplication {

    public static void main(String[] args) {
        // JMX 완전 비활성화
        System.setProperty("spring.jmx.enabled", "false");
        System.setProperty("spring.application.admin.enabled", "false");
        System.setProperty("com.sun.management.jmxremote", "false");
        System.setProperty("com.sun.management.jmxremote.authenticate", "false");
        System.setProperty("com.sun.management.jmxremote.ssl", "false");
        System.setProperty("com.sun.management.jmxremote.local.only", "true");
        System.setProperty("spring.application.admin.jmx-name", "org.springframework.boot:type=Admin,name=SpringApplication");
        System.setProperty("endpoints.jmx.enabled", "false");
        System.setProperty("endpoints.jmx.unique-names", "true");
        System.setProperty("management.endpoints.jmx.exposure.include", "");
        System.setProperty("management.endpoints.jmx.exposure.exclude", "*");
        System.setProperty("management.endpoint.jmx.enabled", "false");

        SpringApplication springApplication = new SpringApplication(SentiMateBackEndApplication.class);
        springApplication.setRegisterShutdownHook(true);
        springApplication.run(args);
    }
}
