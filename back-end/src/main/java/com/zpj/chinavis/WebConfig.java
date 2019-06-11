package com.zpj.chinavis;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                //.allowedOrigins("http://219.216.80.193:8080") // 允许的域
                .allowedOrigins("*") // 允许的域
                .allowedMethods("*")
                .maxAge(3600)
                .allowCredentials(true);
    }
}
