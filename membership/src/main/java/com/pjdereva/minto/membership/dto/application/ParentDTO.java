package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.transaction.ParentType;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ParentDTO extends PersonDTO {

    private Long parentId;
    private ParentType parentType;
    private String notes;
}
