package com.example.placeholder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatorUpdateRequest {
    private String instagramId;
    private String bio;
    private String category;
    private String location;
}
