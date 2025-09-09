package com.example.placeholder.API.Gateway.utils;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.time.Duration;

@Component
public class CookieUtil {

    // Add cookie
    public void addCookie(ServerWebExchange exchange, String name, String value, int maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .path("/")
                .build();

        exchange.getResponse().addCookie(cookie);
    }

    // Delete cookie
    public void deleteCookie(ServerWebExchange exchange, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .maxAge(Duration.ZERO)
                .path("/")
                .build();

        exchange.getResponse().addCookie(cookie);
    }

    // Get cookie
    public String getCookieValue(ServerWebExchange exchange, String name) {
        if (exchange.getRequest().getCookies().getFirst(name) != null) {
            return exchange.getRequest().getCookies().getFirst(name).getValue();
        }
        return null;
    }
}
