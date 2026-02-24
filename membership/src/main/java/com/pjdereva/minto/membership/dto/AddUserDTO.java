package com.pjdereva.minto.membership.dto;

public record AddUserDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        String role,
        String source,
        String picture
) {
}
