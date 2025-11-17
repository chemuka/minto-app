package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.transaction.ParentType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class ParentRequest extends PersonRequest {

    private ParentType parentType;
}
