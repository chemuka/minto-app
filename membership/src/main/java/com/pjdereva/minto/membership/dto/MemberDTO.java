package com.pjdereva.minto.membership.dto;

import com.pjdereva.minto.membership.model.Contact;

import java.time.LocalDateTime;

public record MemberDTO(
        Long userId,
        String memberCreatedAt,
        String memberUpdatedAt,
        Long applicationId
) {
}
