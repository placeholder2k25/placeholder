package com.example.placeholder.API.Gateway.security;

import com.example.placeholder.API.Gateway.utils.CookieUtil;
import com.example.placeholder.API.Gateway.utils.JWTUtil;
import com.example.placeholder.API.Gateway.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class JwtReactiveFilter implements GatewayFilter {

    private final JWTUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final RedisUtil redisUtil;

    public JwtReactiveFilter(JWTUtil jwtUtil, CookieUtil cookieUtil, RedisUtil redisUtil) {
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
        this.redisUtil = redisUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip auth for refresh or health endpoints
        if (path.equals("/spring-boot/api/auth/") || path.equals("/health/check")) {
            return chain.filter(exchange);
        }

        String accessToken = jwtUtil.extractTokenFromCookies(exchange.getRequest());
        String userId = null;
        boolean accessTokenValid = false;

        if (accessToken != null) {
            try {
                userId = jwtUtil.extractUserId(accessToken);
                accessTokenValid = jwtUtil.validateToken(accessToken);
            } catch (Exception ignored) {
                System.out.println("invalid access token");
                accessTokenValid = false;
            }
        }

        if (accessTokenValid && userId != null) {
            // Refresh if token is about to expire
            if (jwtUtil.willExpireSoon(accessToken, 5)) {
                String role = jwtUtil.extractUserRole(accessToken);
                String newAccess = jwtUtil.generateToken(userId, role, 15, "access_token");
                cookieUtil.addCookie(exchange, "access_token", newAccess, 15 * 60);
            }
            // return chain.filter(exchange);
            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Role", jwtUtil.extractUserRole(accessToken))
                    .build();

            System.out.println("userId: " + userId);
            System.out.println("role: " + jwtUtil.extractUserRole(accessToken));
            System.out.println("request goes to downstream");

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }

        // Access token is missing/expired — check refresh handle
        String refreshHandle = cookieUtil.getCookieValue(exchange, "refresh_token");
        if (refreshHandle == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // return redisUtil.getRefreshTokenByHandle(refreshHandle)
        //         .flatMap(storedRefresh -> {
        //             if (storedRefresh == null || !jwtUtil.validateToken(storedRefresh)) {
        //                 exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        //                 return exchange.getResponse().setComplete();
        //             }

        //             String userIdFromRefresh = jwtUtil.extractUserId(storedRefresh);
        //             String role = jwtUtil.extractUserRole(storedRefresh);

        //             String newAccess = jwtUtil.generateToken(userIdFromRefresh, role, 15, "access_token");
        //             String newRefresh = jwtUtil.generateToken(userIdFromRefresh, role, 60 * 24 * 7, "refresh_token");
        //             String newHandle = UUID.randomUUID().toString();

        //             // ✅ Save new refresh handle in Redis
        //             return redisUtil.saveRefreshHandle(newHandle, newRefresh, Duration.ofDays(7))
        //                     .flatMap(v -> {
        //                         // ✅ Add cookies BEFORE forwarding
        //                         cookieUtil.addCookie(exchange, "access_token", newAccess, 15 * 60);
        //                         cookieUtil.addCookie(exchange, "refresh_token", newHandle, 60 * 60 * 24 * 7);

        //                         // ✅ Mutate request headers
        //                         ServerHttpRequest mutatedRequest = exchange.getRequest()
        //                                 .mutate()
        //                                 .header("X-User-Id", userIdFromRefresh)
        //                                 .header("X-User-Role", role)
        //                                 .header("Authorization", newAccess)
        //                                 .build();

        //                         // ✅ Forward request downstream
        //                         return chain.filter(exchange.mutate().request(mutatedRequest).build())
        //                         .then(redisUtil.deleteRefreshHandle(refreshHandle).then(Mono.empty()));
        //                     });
        //         })
        //         .onErrorResume(e -> unauthorizedResponse(exchange, "Unexpected error: " + e.getMessage()));

        return redisUtil.getRefreshTokenByHandle(refreshHandle)
        .flatMap(storedRefresh -> {
            if (storedRefresh == null || !jwtUtil.validateToken(storedRefresh)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String userIdFromRefresh = jwtUtil.extractUserId(storedRefresh);
            String role = jwtUtil.extractUserRole(storedRefresh);

            String newAccess = jwtUtil.generateToken(userIdFromRefresh, role, 15, "access_token");
            String newRefresh = jwtUtil.generateToken(userIdFromRefresh, role, 60 * 24 * 7, "refresh_token");
            String newHandle = UUID.randomUUID().toString();

            // Save new refresh handle in Redis
            Mono<Boolean> saveNewHandle = redisUtil.saveRefreshHandle(newHandle, newRefresh, Duration.ofDays(7));

            // Delete old refresh handle (can run in parallel after saving new one)
            Mono<Boolean> deleteOldHandle = redisUtil.deleteRefreshHandle(refreshHandle);

            return saveNewHandle.flatMap(v -> {
                // Add cookies BEFORE forwarding
                cookieUtil.addCookie(exchange, "access_token", newAccess, 15 * 60);
                cookieUtil.addCookie(exchange, "refresh_token", newHandle, 60 * 60 * 24 * 7);

                // Mutate request headers
                ServerHttpRequest mutatedRequest = exchange.getRequest()
                        .mutate()
                        .header("X-User-Id", userIdFromRefresh)
                        .header("X-User-Role", role)
                        .header("Authorization", newAccess)
                        .build();

                // Forward request downstream
                Mono<Void> downstream = chain.filter(exchange.mutate().request(mutatedRequest).build());

                // Run downstream and old-handle deletion in parallel
                return Mono.when(downstream, deleteOldHandle.then());
            });
        })
        .onErrorResume(e -> unauthorizedResponse(exchange, "Unexpected error: " + e.getMessage()));


    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"error\": \"%s\"}", message);
        DataBuffer buffer = exchange.getResponse()
                .bufferFactory()
                .wrap(body.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

}