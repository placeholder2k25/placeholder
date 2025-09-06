package com.example.placeholder.API.Gateway.utils;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class RedisUtil {

    @Autowired
    private ReactiveRedisTemplate<String, String> redisTemplate;

    // public Mono<Boolean> saveToken(String userId, String refreshToken, Duration
    // expiry) {
    // return redisTemplate
    // .opsForValue()
    // .set("refresh:" + userId, refreshToken, expiry)
    // .doOnError(e -> log.error("Failed to save refresh token for {}: {}", userId,
    // e.getMessage()));
    // }

    // public Mono<String> getToken(String userId) {
    // return redisTemplate
    // .opsForValue()
    // .get("refresh:" + userId)
    // .doOnError(e -> log.error("Failed to get refresh token for {}: {}", userId,
    // e.getMessage()));
    // }

    // public Mono<Boolean> deleteToken(String userId) {
    // return redisTemplate
    // .delete("refresh:" + userId)
    // .map(deleted -> deleted > 0)
    // .doOnError(e -> log.error("Failed to delete refresh token for {}: {}",
    // userId, e.getMessage()));
    // }

    public Mono<Boolean> saveRefreshHandle(String handle, String refreshToken, Duration expiry) {
        return redisTemplate.opsForValue()
                .set("refreshHandle:" + handle, refreshToken, expiry);
    }

    public Mono<String> getRefreshTokenByHandle(String handle) {
        return redisTemplate.opsForValue()
                .get("refreshHandle:" + handle);
    }

    public Mono<Boolean> deleteRefreshHandle(String handle) {
        return redisTemplate.delete("refreshHandle:" + handle)
                .map(deleted -> deleted > 0);
    }

}
