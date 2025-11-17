package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.transaction.SiblingType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class SiblingRequest extends PersonRequest {

    private SiblingType siblingType;
}
