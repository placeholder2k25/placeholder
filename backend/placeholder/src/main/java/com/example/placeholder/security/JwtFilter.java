package com.example.placeholder.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.placeholder.models.UserPrincipal;
import com.example.placeholder.services.UserDetailsServiceImpl;
import com.example.placeholder.utils.CookieUtil;
import com.example.placeholder.utils.JWTUtil;
import com.example.placeholder.utils.RedisUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtil jwtService;

    @Autowired
    private ApplicationContext context;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private RedisUtil redisService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip token refresh and health check endpoints
        if (path.equals("/api/token/refresh") || path.equals("/health/check")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = cookieUtil.getCookieValue(request, "access_token");
        String username = null;
        UserDetails userDetails = null;
        boolean accessTokenValid = false;

        try {
            if (accessToken != null) {
                username = jwtService.extractUsernameEvenIfExpired(accessToken);
                userDetails = context.getBean(UserDetailsServiceImpl.class).loadUserByUsername(username);
                accessTokenValid = jwtService.validateToken(accessToken, userDetails);
            }
        } catch (Exception ignored) {}

        if (accessTokenValid && username != null) {
            // Refresh access token if it is about to expire
            if (jwtService.willExpireSoon(accessToken, 5)) {
                String role = ((UserPrincipal) userDetails).getUser().getRole();
                String newAccessToken = jwtService.generateToken(username, role, 15, "access_token");
                cookieUtil.addCookie(response, "access_token", newAccessToken, 15 * 60); // 15 minutes
            }

            setAuthentication(userDetails, request);

        } else {
            // Handle refresh token flow
            if (username == null) {
                username = cookieUtil.getCookieValue(request, "username");
            }

            if (username != null) {
                try {
                    userDetails = context.getBean(UserDetailsServiceImpl.class).loadUserByUsername(username);
                    String storedRefreshToken = redisService.getToken("refresh_token", username);

                    boolean refreshTokenValid = storedRefreshToken != null &&
                            jwtService.validateToken(storedRefreshToken, userDetails);

                    if (refreshTokenValid) {
                        String role = ((UserPrincipal) userDetails).getUser().getRole();
                        String newAccessToken = jwtService.generateToken(username, role, 15, "access_token");
                        cookieUtil.addCookie(response, "access_token", newAccessToken, 15 * 60);

                        if (jwtService.willExpireSoon(storedRefreshToken, 60 * 24)) {
                            String newRefreshToken = jwtService.generateToken(username, role, 60 * 24 * 7, "refresh_token");
                            redisService.setToken("refresh_token", username, newRefreshToken, 60 * 24 * 7 * 60);
                        }

                        cookieUtil.addCookie(response, "username", username, 60 * 60 * 24 * 7);

                    } else {
                        redisService.deleteToken("refresh_token", username);

                        String role = ((UserPrincipal) userDetails).getUser().getRole();
                        String newAccessToken = jwtService.generateToken(username, role, 15, "access_token");
                        String newRefreshToken = jwtService.generateToken(username, role, 60 * 24 * 7, "refresh_token");

                        redisService.setToken("refresh_token", username, newRefreshToken, 60 * 24 * 7 * 60);

                        cookieUtil.addCookie(response, "access_token", newAccessToken, 15 * 60);
                        cookieUtil.addCookie(response, "username", username, 60 * 60 * 24 * 7);
                    }

                    setAuthentication(userDetails, request);

                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                System.out.println("[JWT Filter] User not authenticated. No username found.");
            }
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}

