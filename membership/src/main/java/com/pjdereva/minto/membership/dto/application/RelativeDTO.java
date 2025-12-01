package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.FamilyRelationship;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class RelativeDTO extends PersonDTO {

    private Long relativeId;
    private String membershipNumber;
    private FamilyRelationship relationship;
    private String notes;
}
