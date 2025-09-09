package com.example.placeholder.services;

import java.util.Map;
import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.placeholder.dto.AuthResponse;
import com.example.placeholder.dto.BrandUpdateRequest;
import com.example.placeholder.dto.CreatorUpdateRequest;
import com.example.placeholder.dto.LoginRequest;
import com.example.placeholder.dto.RegistrationRequest;
import com.example.placeholder.exception.ResourceNotFoundException;
import com.example.placeholder.models.UserModel;
import com.example.placeholder.repository.UserRepository;
import com.example.placeholder.utils.JWTUtil;
import com.example.placeholder.utils.RedisUtil;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtservice;

    @Autowired
    private RedisUtil redisService;

    public ResponseEntity<AuthResponse> registerUser(@Valid RegistrationRequest request) {
        try {
            String rawUsername = sanitize(request.getUsername());
            String rawEmail = sanitize(request.getEmail());

            log.info("Attempting to register user with username: '{}'", rawUsername);

            // Build user entity
            UserModel.UserModelBuilder userBuilder = UserModel.builder()
                    .username(rawUsername)
                    .email(rawEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phoneNumber(request.getPhoneNumber())
                    .role(request.getRole().toUpperCase())
                    .termsAccepted(request.isTermsAccepted())
                    .isProfileComplete(false);

            if ("BRAND".equalsIgnoreCase(request.getRole())) {
                userBuilder
                        .brandName("")
                        .website("")
                        .companyType("")
                        .brandDescription("")
                        .locationUrl("")
                        .socialMediaHandles(UserModel.SocialMediaHandles.builder().build());
            } else if ("CREATOR".equalsIgnoreCase(request.getRole())) {
                userBuilder
                        .instagramId("")
                        .bio("")
                        .category("")
                        .location("");
            }

            UserModel user = userBuilder.build();
            userRepository.save(user);

            // Generate tokens
            Map<String, String> tokens = generateAndStoreTokens(
                    user.getUserId(),
                    user.getRole(),
                    10,
                    60 * 24 * 7 // refresh token validity in minutes
            );

            log.info("✅ User '{}' registered successfully", user.getUsername());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(tokens.get("access_Token"), tokens.get("refresh_Token_handle")));

        } catch (Exception e) {
            log.error("Error during user registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Internal server error", null));
        }
    }

    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            String rawUsername = sanitize(request.getUsername());

            log.info("🔐 Attempting login for username: '{}'", rawUsername);

            // Find user
            UserModel user = userRepository.findByUsername(rawUsername)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + rawUsername));

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadRequestException("Invalid username or password");
            }

            // Generate tokens
            int accessTokenValidityMinutes = 10;
            int refreshTokenValidityMinutes = request.isRememberMe() ? 60 * 24 * 7 : 60 * 24;

            Map<String, String> tokens = generateAndStoreTokens(
                    user.getUserId(),
                    user.getRole(),
                    accessTokenValidityMinutes,
                    refreshTokenValidityMinutes);

            log.info("✅ User '{}' logged in successfully", user.getUsername());

            return ResponseEntity.ok(
                    new AuthResponse(
                            tokens.get("access_Token"), tokens.get("refresh_Token_handle")));

        } catch (ResourceNotFoundException | BadRequestException e) {
            log.warn("⚠️ Login failed for '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(e.getMessage(), null));
        } catch (Exception e) {
            log.error("❌ Unexpected error during login for '{}'", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Internal server error", null));
        }
    }

    private String sanitize(String value) {
        return value != null ? value.trim() : "";
    }

    private Map<String, String> generateAndStoreTokens(String userId, String role, long accessExpiryMin,
            long refreshExpiryMin) {
        String accessToken = jwtservice.generateToken(userId, role, accessExpiryMin, "access_Token");
        String refreshToken = jwtservice.generateToken(userId, role, refreshExpiryMin, "refresh_Token");

        String newHandle = UUID.randomUUID().toString();

        redisService.setToken(newHandle, "refreshHandle", refreshToken, refreshExpiryMin * 60);

        return Map.of("access_Token", accessToken, "refresh_Token_handle", newHandle);
    }

    // public UserModel updateBrandDetails(String userId, @Valid BrandUpdateRequest
    // request) {
    // UserModel user = userRepository.findById(userId)
    // .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    // if (!"BRAND".equalsIgnoreCase(user.getRole())) {
    // new BadRequestException("User is not allowed to update brand details");
    // }

    // UserModel.BrandDetails brandDetails = UserModel.BrandDetails.builder()
    // .brandName(request.getBrandName())
    // .website(request.getWebsite())
    // .companyType(request.getCompanyType())
    // .brandDescription(request.getBrandDescription())
    // .locationUrl(request.getLocationUrl())
    // // .socialMediaHandles(UserModel.SocialMediaHandles.builder()
    // // .instagram(request.getSocialMediaHandles().getInstagram())
    // // .facebook(request.getSocialMediaHandles().getFacebook())
    // // .twitter(request.getSocialMediaHandles().getTwitter())
    // // .build())
    // .build();

    // user.setBrandDetails(brandDetails);
    // return userRepository.save(user);
    // }

    // public UserModel updateCreatorDetails(String userId, @Valid
    // CreatorUpdateRequest request) {
    // UserModel user = userRepository.findById(userId)
    // .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " +
    // userId));

    // if (!"CREATOR".equalsIgnoreCase(user.getRole())) {
    // new BadRequestException("User is not allowed to update creator details");
    // }

    // UserModel.CreatorDetails creatorDetails = UserModel.CreatorDetails.builder()
    // .instagramId(request.getInstagramId())
    // .bio(request.getBio())
    // .category(request.getCategory())
    // .location(request.getLocation())
    // .build();

    // user.setCreatorDetails(creatorDetails);
    // return userRepository.save(user);
    // }

    public UserModel updateBrandDetails(String userId, @Valid BrandUpdateRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!"BRAND".equalsIgnoreCase(user.getRole())) {
            new BadRequestException("User is not allowed to update brand details");
        }

        // Update flat fields
        user.setBrandName(request.getBrandName());
        user.setWebsite(request.getWebsite());
        user.setCompanyType(request.getCompanyType());
        user.setBrandDescription(request.getBrandDescription());
        user.setLocationUrl(request.getLocationUrl());
        user.setIsProfileComplete(true);

        // Update nested social media handles if provided
        // if (request.getSocialMediaHandles() != null) {
        // UserModel.SocialMediaHandles handles = user.getSocialMediaHandles();
        // if (handles == null) {
        // handles = UserModel.SocialMediaHandles.builder().build();
        // }
        // handles.setInstagram(request.getSocialMediaHandles().getInstagram());
        // handles.setFacebook(request.getSocialMediaHandles().getFacebook());
        // handles.setTwitter(request.getSocialMediaHandles().getTwitter());
        // user.setSocialMediaHandles(handles);
        // }

        return userRepository.save(user);
    }

    public UserModel updateCreatorDetails(String userId, @Valid CreatorUpdateRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!"CREATOR".equalsIgnoreCase(user.getRole())) {
            new BadRequestException("User is not allowed to update creator details");
        }

        // Update flat creator fields
        user.setInstagramId(request.getInstagramId());
        user.setBio(request.getBio());
        user.setCategory(request.getCategory());
        user.setLocation(request.getLocation());
        user.setIsProfileComplete(true);

        return userRepository.save(user);
    }

}
