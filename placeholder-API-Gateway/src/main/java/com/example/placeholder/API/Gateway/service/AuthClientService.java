package com.example.placeholder.API.Gateway.service;

import java.time.Duration;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.placeholder.API.Gateway.dto.AuthResponse;

import reactor.core.publisher.Mono;

@Service
public class AuthClientService {

    private WebClient webClient;

    public AuthClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<AuthResponse> login(String path, String requestBody) {
        return post(path, requestBody);
    }

    public Mono<AuthResponse> register(String path, String requestBody) {
        return post(path, requestBody);
    }

    public Mono<AuthResponse> forgotPassword(String path, String requestBody) {
        return post(path, requestBody);
    }

    public Mono<AuthResponse> refresh(String path, String requestBody) {
        return post(path, requestBody);
    }

    private Mono<AuthResponse> post(String path, String requestBody) {
        return webClient.post()
                .uri("http://localhost:8081" + path)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToMono(AuthResponse.class);
    }

    public ResponseCookie createAccessCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .build();
    }

    public ResponseCookie createRefreshCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();
    }
}
