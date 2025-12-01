package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class SpouseDTO extends PersonDTO {

    private Long spouseId;
    private MaritalStatus maritalStatus;
    private String notes;
}
