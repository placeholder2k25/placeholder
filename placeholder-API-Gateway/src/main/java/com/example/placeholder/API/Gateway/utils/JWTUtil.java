package com.example.placeholder.API.Gateway.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;

@Service
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    // ✅ Generate token with userId + role
    public String generateToken(String userId, String role, long expiryMinutes, String tokenType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", tokenType);
        claims.put("role", role.toUpperCase());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId) // 👈 userId is subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiryMinutes * 60 * 1000))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ Extract userId (sub)
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ✅ Extract role
    public String extractUserRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // ✅ Extract token type (access_token / refresh_token)
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Validate by just checking expiry & subject match
    // public boolean validateToken(String token, String expectedUserId) {
    // try {
    // final String userId = extractUserId(token);
    // return userId.equals(expectedUserId) && !isTokenExpired(token);
    // } catch (Exception e) {
    // return false;
    // }
    // }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // throws if invalid/expired
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // private boolean isTokenExpired(String token) {
    //     return extractExpiration(token).before(new Date());
    // }

    // private Date extractExpiration(String token) {
    //     return extractClaim(token, Claims::getExpiration);
    // }

    // ✅ Get access token from cookie
    public String extractTokenFromCookies(ServerHttpRequest request) {
        HttpCookie cookie = request.getCookies().getFirst("access_token");
        return cookie != null ? cookie.getValue() : null;
    }

    // ✅ Get username/userId from cookie (if stored separately)
    public String extractUserIdFromCookies(ServerHttpRequest request) {
        HttpCookie cookie = request.getCookies().getFirst("username"); // 🔄 better rename cookie to "userId"
        return cookie != null ? cookie.getValue() : null;
    }

    // ✅ Handle expired tokens gracefully
    public String extractUserIdEvenIfExpired(String token) {
        try {
            return extractUserId(token);
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        }
    }

    // ✅ Check if token will expire soon
    public boolean willExpireSoon(String token, int thresholdMinutes) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expirationDate = claims.getExpiration();
            long currentTimeMillis = System.currentTimeMillis();
            long thresholdMillis = thresholdMinutes * 60 * 1000L;

            return expirationDate.getTime() - currentTimeMillis <= thresholdMillis;
        } catch (Exception e) {
            return true;
        }
    }
}