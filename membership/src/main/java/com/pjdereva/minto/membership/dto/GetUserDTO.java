package com.pjdereva.minto.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String source;
    private String picture;
    private String createdAt;
    private String updatedAt;
}
