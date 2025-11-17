package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.transaction.ChildType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class ChildRequest extends PersonRequest {

    private ChildType childType;
}
