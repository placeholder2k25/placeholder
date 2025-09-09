package com.example.placeholder.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.placeholder.dto.AuthResponse;
import com.example.placeholder.dto.LoginRequest;
import com.example.placeholder.dto.RegistrationRequest;
import com.example.placeholder.services.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request, HttpServletResponse response) {
        ResponseEntity<AuthResponse> result = userService.registerUser(request);
        AuthResponse responseBody = result.getBody();

        if (result.getStatusCode() == HttpStatus.CREATED && responseBody != null) {
            return ResponseEntity.ok(responseBody);
        }

        return ResponseEntity
                .status(result.getStatusCode())
                .body(Map.of("error", "Registration failed"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        ResponseEntity<AuthResponse> result = userService.loginUser(request);
        AuthResponse responseBody = result.getBody();

        if(result.getStatusCode() == HttpStatus.OK && responseBody != null){

            return ResponseEntity.ok(responseBody);
        }

        return ResponseEntity
                .status(result.getStatusCode())
                .body(Map.of("error", "Login failed"));
    }
}
