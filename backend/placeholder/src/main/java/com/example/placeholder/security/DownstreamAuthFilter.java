package com.example.placeholder.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.placeholder.models.UserModel;
import com.example.placeholder.models.UserPrincipal;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class DownstreamAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String userId = request.getHeader("X-User-Id");
        String role = request.getHeader("X-User-Role");
        String access = request.getHeader("Authorization");

        // Debug: print incoming headers
        System.out.println("[DEBUG] X-User-Id: " + userId);
        System.out.println("[DEBUG] X-User-Role: " + role);

        if (userId != null && role != null) {
            // Build a lightweight UserModel just for context
            UserModel userModel = new UserModel();
            userModel.setUserId(userId);
            userModel.setRole(role);

            UserPrincipal principal = new UserPrincipal(userModel);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            principal, access, principal.getAuthorities()
                    );

            // Debug: print authorities being set
            System.out.println("[DEBUG] Setting authentication with authorities: " + principal.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
        } else {
            System.out.println("[DEBUG] Missing X-User-Id or X-User-Role → authentication not set");
        }

        filterChain.doFilter(request, response);
    }
}
