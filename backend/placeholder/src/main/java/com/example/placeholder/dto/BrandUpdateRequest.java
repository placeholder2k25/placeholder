package com.example.placeholder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandUpdateRequest {
    private String brandName;
    private String website;
    private String companyType;
    private String brandDescription;
    private String location;
    private SocialMediaHandlesDTO socialMediaHandles;

    @Data
    public static class SocialMediaHandlesDTO {
        private String instagram;
        private String facebook;
        private String twitter;
    }
}
