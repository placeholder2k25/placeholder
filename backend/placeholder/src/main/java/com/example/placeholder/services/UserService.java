package com.example.placeholder.services;

import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.placeholder.dto.BrandUpdateRequest;
import com.example.placeholder.dto.CreatorUpdateRequest;
import com.example.placeholder.dto.LoginRequest;
import com.example.placeholder.dto.LoginResponse;
import com.example.placeholder.dto.RegisterResponse;
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

    public ResponseEntity<RegisterResponse> registerUser(@Valid RegistrationRequest request) {
        try {
            String rawUsername = sanitize(request.getUsername());
            String rawEmail = sanitize(request.getEmail());

            log.info("Attempting to register user with username: '{}'", rawUsername);

            // Build user entity
            UserModel.UserModelBuilder userBuilder = UserModel.builder()
                    .username(rawUsername)
                    .email(rawEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phoneNo(request.getPhoneNo())
                    .role(request.getRole())
                    .termsAccepted(request.isTermsAccepted());

            if ("BRAND".equalsIgnoreCase(request.getRole())) {
                userBuilder.brandDetails(UserModel.BrandDetails.builder().build());
            } else if ("CREATOR".equalsIgnoreCase(request.getRole())) {
                userBuilder.creatorDetails(UserModel.CreatorDetails.builder().build());
            }

            UserModel user = userBuilder.build();
            userRepository.save(user);

            // Generate tokens
            Map<String, String> tokens = generateAndStoreTokens(user.getUsername(), user.getRole(), 10, 60 * 24 * 7);
            log.info("✅ User '{}' registered successfully", user.getUsername());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegisterResponse(user.getUsername(), tokens.get("access_Token")));
        } catch (Exception e) {
            log.error("Error during user registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse("Internal server error", null));
        }
    }

    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request) {
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
                    user.getUsername(),
                    user.getRole(),
                    accessTokenValidityMinutes,
                    refreshTokenValidityMinutes);

            log.info("✅ User '{}' logged in successfully", user.getUsername());

            return ResponseEntity.ok(
                    new LoginResponse(user.getUsername(),
                            tokens.get("access_Token")));

        } catch (ResourceNotFoundException | BadRequestException e) {
            log.warn("⚠️ Login failed for '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(e.getMessage(), null));
        } catch (Exception e) {
            log.error("❌ Unexpected error during login for '{}'", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse("Internal server error", null));
        }
    }

    private String sanitize(String value) {
        return value != null ? value.trim() : "";
    }

    private Map<String, String> generateAndStoreTokens(String username, String role, long accessExpiryMin,
            long refreshExpiryMin) {
        String accessToken = jwtservice.generateToken(username, role, accessExpiryMin, "access_Token");
        String refreshToken = jwtservice.generateToken(username, role, refreshExpiryMin, "refresh_Token");

        redisService.setToken("refresh_token", username, refreshToken, refreshExpiryMin * 60);

        return Map.of("access_Token", accessToken, "refresh_Token", refreshToken);
    }

    public UserModel updateBrandDetails(String userId, @Valid BrandUpdateRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"BRAND".equalsIgnoreCase(user.getRole())) {
            new BadRequestException("User is not allowed to update brand details");
        }

        UserModel.BrandDetails brandDetails = UserModel.BrandDetails.builder()
                .brandName(request.getBrandName())
                .website(request.getWebsite())
                .companyType(request.getCompanyType())
                .brandDescription(request.getBrandDescription())
                .location(request.getLocation())
                .socialMediaHandles(UserModel.SocialMediaHandles.builder()
                        .instagram(request.getSocialMediaHandles().getInstagram())
                        .facebook(request.getSocialMediaHandles().getFacebook())
                        .twitter(request.getSocialMediaHandles().getTwitter())
                        .build())
                .build();

        user.setBrandDetails(brandDetails);
        return userRepository.save(user);
    }

    public UserModel updateCreatorDetails(String userId, @Valid CreatorUpdateRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!"CREATOR".equalsIgnoreCase(user.getRole())) {
            new BadRequestException("User is not allowed to update creator details");
        }

        UserModel.CreatorDetails creatorDetails = UserModel.CreatorDetails.builder()
                .instagramId(request.getInstagramId())
                .bio(request.getBio())
                .category(request.getCategory())
                .location(request.getLocation())
                .build();

        user.setCreatorDetails(creatorDetails);
        return userRepository.save(user);
    }

}
