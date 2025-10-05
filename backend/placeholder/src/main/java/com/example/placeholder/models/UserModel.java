package com.example.placeholder.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class UserModel {

    @Id
    private String userId;

    @Indexed(unique = true)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters long")
    private String password;

    @Indexed(unique = true)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Terms must be accepted")
    private Boolean termsAccepted;

    @Builder.Default
    private Boolean isProfileComplete = false;

    // --- Brand fields flattened ---
    private String brandName;
    private String website;
    private String companyType;
    private String brandDescription;
    private String locationUrl;

    // --- Social media nested ---
    @Builder.Default
    private SocialMediaHandles socialMediaHandles = SocialMediaHandles.builder().build();

    // --- Creator Details directly here ---
    private String instagramId;
    private String bio;
    private String category;
    private String location;

    @Data
    @Builder
    public static class SocialMediaHandles {
        @Builder.Default
        private String instagram = "";
        @Builder.Default
        private String facebook = "";
        @Builder.Default
        private String twitter = "";
    }
}
