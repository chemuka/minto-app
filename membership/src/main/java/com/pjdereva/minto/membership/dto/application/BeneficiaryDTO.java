package com.pjdereva.minto.membership.dto.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class BeneficiaryDTO extends PersonDTO {

    private Long beneficiaryId;
    private BigDecimal percentage;
    private String relationship;
    private String notes;
}
