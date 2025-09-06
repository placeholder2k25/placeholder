package com.example.placeholder.API.Gateway.security;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.example.placeholder.API.Gateway.dto.AuthResponse;
import com.example.placeholder.API.Gateway.service.AuthClientService;

// import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

// @Component
// @Slf4j
// public class AuthFilter implements GatewayFilter {

//     private final AuthClientService authServiceClient;
//     private final Map<String, BiFunction<String, String, Mono<AuthResponse>>> handlers;

//     public AuthFilter(AuthClientService authServiceClient) {
//         this.authServiceClient = authServiceClient;
//         this.handlers = Map.of(
//                 "/api/auth/login", authServiceClient::login,
//                 "/api/auth/register", authServiceClient::register);
//     }

//     @Override
//     public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//         String path = exchange.getRequest().getURI().getPath();

//         BiFunction<String, String, Mono<AuthResponse>> handler = handlers.get(path);
//         if (handler != null) {
//             return exchange.getRequest().getBody()
//                     .collectList()
//                     .map(this::extractBody)
//                     .flatMap(body -> handler.apply(path, body))
//                     .flatMap(tokens -> writeResponse(exchange, tokens, path));
//         }

//         return chain.filter(exchange);
//     }

//     private String extractBody(List<DataBuffer> dataBuffers) {
//         byte[] bytes = dataBuffers.stream()
//                 .map(DataBuffer::asInputStream)
//                 .flatMap(is -> {
//                     try {
//                         return java.util.stream.Stream.of(is.readAllBytes());
//                     } catch (IOException e) {
//                         throw new RuntimeException(e);
//                     }
//                 })
//                 .reduce(new byte[0], (a, b) -> {
//                     byte[] c = new byte[a.length + b.length];
//                     System.arraycopy(a, 0, c, 0, a.length);
//                     System.arraycopy(b, 0, c, a.length, b.length);
//                     return c;
//                 });
//         return new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
//     }

//     private Mono<Void> writeResponse(ServerWebExchange exchange, AuthResponse tokens, String path) {
//         // Only login/refresh might return tokens → add cookies
//         if (tokens.getAccessToken() != null && tokens.getRefreshToken() != null) {
//             exchange.getResponse().addCookie(authServiceClient.createAccessCookie(tokens.getAccessToken()));
//             exchange.getResponse().addCookie(authServiceClient.createRefreshCookie(tokens.getRefreshToken()));
//         }

//         // Customize success message based on path
//         String message = switch (path) {
//             case "/api/auth/login" -> "Login successful";
//             case "/api/auth/register" -> "Registration successful";
//             case "/api/auth/forgot-password" -> "Password reset request successful";
//             case "/api/auth/refresh" -> "Token refreshed successfully";
//             default -> "Operation successful";
//         };

//         byte[] body = String.format("{\"success\":\"%s\"}", message)
//                 .getBytes(java.nio.charset.StandardCharsets.UTF_8);
//         DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(body);

//         exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
//         return exchange.getResponse().writeWith(Mono.just(buffer));
//     }
// }

@Component
public class AuthFilter implements GatewayFilter {

    private final AuthClientService authServiceClient;
    private final Map<String, BiFunction<String, String, Mono<AuthResponse>>> handlers;

    public AuthFilter(AuthClientService authServiceClient) {
        this.authServiceClient = authServiceClient;
        this.handlers = Map.of(
                "/api/auth/login", authServiceClient::login,
                "/api/auth/register", authServiceClient::register
        );
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        System.out.println("Incoming request path: " + path);

        BiFunction<String, String, Mono<AuthResponse>> handler = handlers.get(path);
        if (handler != null) {
            System.out.println("Handler found for path: " + path);

            return exchange.getRequest().getBody()
                    .collectList()
                    .map(this::extractBody)
                    .doOnNext(body -> System.out.println("Request body for " + path + ": " + body))
                    .flatMap(body -> {
                        System.out.println("Calling AuthClientService for path: " + path);
                        return handler.apply(path, body);
                    })
                    .doOnNext(tokens -> System.out.println(
                            "Received tokens for " + path +
                                    ": accessToken=" + (tokens.getAccessToken() != null ? "present" : "null") +
                                    ", refreshToken=" + (tokens.getRefreshToken() != null ? "present" : "null")
                    ))
                    .flatMap(tokens -> writeResponse(exchange, tokens, path));
        }

        System.out.println("No auth handler matched for path: " + path + ". Passing to next filter.");
        return chain.filter(exchange);
    }

    private String extractBody(List<DataBuffer> dataBuffers) {
        System.out.println("Extracting body from " + dataBuffers.size() + " dataBuffers");

        byte[] bytes = dataBuffers.stream()
                .map(DataBuffer::asInputStream)
                .flatMap(is -> {
                    try {
                        return java.util.stream.Stream.of(is.readAllBytes());
                    } catch (IOException e) {
                        System.out.println("Error reading request body: " + e.getMessage());
                        throw new RuntimeException(e);
                    }
                })
                .reduce(new byte[0], (a, b) -> {
                    byte[] c = new byte[a.length + b.length];
                    System.arraycopy(a, 0, c, 0, a.length);
                    System.arraycopy(b, 0, c, a.length, b.length);
                    return c;
                });

        String body = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
        System.out.println("Extracted body: " + body);
        return body;
    }

    private Mono<Void> writeResponse(ServerWebExchange exchange, AuthResponse tokens, String path) {
        System.out.println("Preparing response for path: " + path);

        // Only login/refresh might return tokens → add cookies
        if (tokens.getAccessToken() != null && tokens.getRefreshToken() != null) {
            System.out.println("Adding access and refresh cookies for " + path);
            exchange.getResponse().addCookie(authServiceClient.createAccessCookie(tokens.getAccessToken()));
            exchange.getResponse().addCookie(authServiceClient.createRefreshCookie(tokens.getRefreshToken()));
        } else {
            System.out.println("No tokens to add as cookies for " + path);
        }

        // Customize success message based on path
        String message = switch (path) {
            case "/api/auth/login" -> "Login successful";
            case "/api/auth/register" -> "Registration successful";
            case "/api/auth/forgot-password" -> "Password reset request successful";
            case "/api/auth/refresh" -> "Token refreshed successfully";
            default -> "Operation successful";
        };

        System.out.println("Responding with success message: " + message);

        byte[] body = String.format("{\"success\":\"%s\"}", message)
                .getBytes(java.nio.charset.StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(body);

        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}

