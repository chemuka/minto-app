package com.pjdereva.minto.membership.payload.request.application;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class RefereeRequest extends PersonRequest {

    private String membershipNumber;
}
