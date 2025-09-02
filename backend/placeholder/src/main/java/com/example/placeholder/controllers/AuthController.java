package com.example.placeholder.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.placeholder.dto.LoginRequest;
import com.example.placeholder.dto.LoginResponse;
import com.example.placeholder.dto.RegisterResponse;
import com.example.placeholder.dto.RegistrationRequest;
import com.example.placeholder.services.UserService;
import com.example.placeholder.utils.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    @Autowired
    private CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request, HttpServletResponse response) {
        ResponseEntity<RegisterResponse> result = userService.registerUser(request);
        RegisterResponse responseBody = result.getBody();

        if (result.getStatusCode() == HttpStatus.CREATED && responseBody != null) {
            cookieUtil.addCookie(response, "access_token", responseBody.getToken(), 600);
            cookieUtil.addCookie(response, "username", request.getUsername(), 60 * 60 * 24 * 30);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of("username", responseBody.getUsername()));
        }

        return ResponseEntity
                .status(result.getStatusCode())
                .body(Map.of("error", "Registration failed"));
    }

    @GetMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        ResponseEntity<LoginResponse> result = userService.loginUser(request);
        LoginResponse responseBody = result.getBody();

        if(result.getStatusCode() == HttpStatus.OK && responseBody != null){
            cookieUtil.addCookie(response, "access_token", responseBody.getToken(), 600);
            cookieUtil.addCookie(response, "username", responseBody.getUsername(), 60 * 60 * 24 * 30);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(Map.of("success", "Login successful"));
        }

        return ResponseEntity
                .status(result.getStatusCode())
                .body(Map.of("error", "Login failed"));
    }
}
