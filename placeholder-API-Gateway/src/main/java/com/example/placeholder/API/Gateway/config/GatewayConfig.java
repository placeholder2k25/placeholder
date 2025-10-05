package com.example.placeholder.API.Gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.placeholder.API.Gateway.security.AuthFilter;
import com.example.placeholder.API.Gateway.security.JwtReactiveFilter;

@Configuration
public class GatewayConfig {

    private final AuthFilter authFilter;
    private final JwtReactiveFilter jwtReactiveFilter;

    public GatewayConfig(AuthFilter authFilter, JwtReactiveFilter jwtReactiveFilter) {
        this.authFilter = authFilter;
        this.jwtReactiveFilter = jwtReactiveFilter;
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-routes", r -> r.path("/api/auth/**")
                        .filters(f -> f.filter(authFilter)) // apply AuthFilter directly
                        .uri("http://localhost:8081"))
                .route("springboot-service", r -> r.path("/spring-boot/api/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtReactiveFilter))
                        .uri("http://localhost:8081"))
                .route("flask-service", r -> r.path("/flask/api/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("http://localhost:5000"))
                .build();
    }
}
