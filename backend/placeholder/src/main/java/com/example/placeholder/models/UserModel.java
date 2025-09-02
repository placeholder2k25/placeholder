package com.example.placeholder.models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@Document(collection = "users")
public class UserModel {

    @Id
    private String id;

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
    private String phoneNo;

    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Terms must be accepted")
    private Boolean termsAccepted;

    @Builder.Default
    private BrandDetails brandDetails = null;

    @Builder.Default
    private CreatorDetails creatorDetails = null;

    @Data
    @Builder
    public static class BrandDetails {
        @Builder.Default
        private String brandName = "";
        @Builder.Default
        private String website = "";
        @Builder.Default
        private String companyType = "";
        @Builder.Default
        private String brandDescription = "";
        @Builder.Default
        private String location = "";
        @Builder.Default
        private SocialMediaHandles socialMediaHandles = SocialMediaHandles.builder().build();
    }

    @Data
    @Builder
    public static class CreatorDetails {
        @Builder.Default
        private String instagramId = "";
        @Builder.Default
        private String bio = "";
        @Builder.Default
        private String category = "";
        @Builder.Default
        private String location = "";
    }

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
