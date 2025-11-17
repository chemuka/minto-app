package com.pjdereva.minto.membership.dto;

import com.pjdereva.minto.membership.model.Contact;

public record PersonDTO(
        String firstName,
        String middleName,
        String lastName,
        String dob,
        String lifeStatus,
        String createdAt,
        String updatedAt,
        Contact contact
) {
}
