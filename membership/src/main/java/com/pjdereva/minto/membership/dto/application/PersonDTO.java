package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PersonDTO {

    private Long personId;
    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dob;
    private LifeStatus lifeStatus;
    private String createdAt;
    private String updatedAt;
    private ContactDTO contact;
}
