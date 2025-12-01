package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.SiblingType;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class SiblingDTO extends PersonDTO {

    private Long siblingId;
    private SiblingType siblingType;
    private String notes;
}
