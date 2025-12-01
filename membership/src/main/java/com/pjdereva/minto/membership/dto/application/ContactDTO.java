package com.pjdereva.minto.membership.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactDTO {

    private Long contactId;
    private List<AddressDTO> addresses;
    private List<PhoneDTO> phones;
    private List<EmailDTO> emails;
    private String createdAt;
    private String updatedAt;
    private String notes;
}
