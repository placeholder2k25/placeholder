package com.example.placeholder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandUpdateRequest {
    @NotBlank(message = "Brand name is required")
    private String brandName;
    private String website;
    private String companyType;
    private String brandDescription;
    private String locationUrl;
    // private SocialMediaHandlesDTO socialMediaHandles;

    // @Data
    // public static class SocialMediaHandlesDTO {
    //     private String instagram;
    //     private String facebook;
    //     private String twitter;
    // }
}
