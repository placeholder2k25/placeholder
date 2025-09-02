package com.example.placeholder.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.placeholder.dto.BrandUpdateRequest;
import com.example.placeholder.dto.CreatorUpdateRequest;
import com.example.placeholder.models.UserModel;
import com.example.placeholder.models.UserPrincipal;
import com.example.placeholder.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PutMapping("/brand")
    public ResponseEntity<UserModel> updateBrandDetails(@AuthenticationPrincipal UserPrincipal user, @RequestBody BrandUpdateRequest request) {
        UserModel updatedUser = userService.updateBrandDetails(user.getUserId(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/creator")
    public ResponseEntity<UserModel> updateCreatorDetails(@AuthenticationPrincipal UserPrincipal user, @RequestBody CreatorUpdateRequest request) {
        UserModel updatedUser = userService.updateCreatorDetails(user.getUserId(), request);
        return ResponseEntity.ok(updatedUser);
    }
}
