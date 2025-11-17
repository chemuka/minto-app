package com.pjdereva.minto.membership.payload.request.application;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class BeneficiaryRequest extends PersonRequest {

    private BigDecimal percentage;
    private String relationship;
}
