package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.ChildType;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ChildDTO extends PersonDTO {

    private Long childId;
    private ChildType childType;
    private String notes;
}
