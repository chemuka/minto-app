package com.pjdereva.minto.membership.dto.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class RefereeDTO extends PersonDTO {

    private Long refereeId;
    private String membershipNumber;
    private String comments;
    private String notes;
}
