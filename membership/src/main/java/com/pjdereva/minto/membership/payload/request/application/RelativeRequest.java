package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.transaction.FamilyRelationship;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class RelativeRequest extends PersonRequest {

    private String membershipNumber;
    private FamilyRelationship relationship;
}
