package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.PhoneType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PhoneRequest {

    private PhoneType type;
    private String number;
    private String countryCode;
}
