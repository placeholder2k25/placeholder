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

    public Mono<Boolean> saveRefreshHandle(String handle, String refreshToken, Duration expiry) {
        return redisTemplate.opsForValue()
                .set("refreshHandle:" + handle, refreshToken, expiry);
    }

    public Mono<String> getRefreshTokenByHandle(String handle) {
    String key = "refreshHandle:" + handle;

    return redisTemplate.opsForValue()
            .get(key)
            .doOnNext(val -> {
                log.info("✅ Redis hit for key={} -> {}", key, val);
            })
            .switchIfEmpty(Mono.fromRunnable(() -> {
                log.warn("⚠️ No refresh token found in Redis for key={}", key);
            }))
            .doOnError(err -> {
                log.error("❌ Redis error while fetching key={}", key, err);
            });
}


    public Mono<Boolean> deleteRefreshHandle(String handle) {
        return redisTemplate.delete("refreshHandle:" + handle)
                .map(deleted -> deleted > 0);
    }

}
