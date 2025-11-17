package com.pjdereva.minto.membership.payload.request.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactRequest {

    private List<AddressRequest> addresses;
    private List<PhoneRequest> phones;
    private List<EmailRequest> emails;
}
