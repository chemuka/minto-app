package com.pjdereva.minto.membership.dto.application;

import com.pjdereva.minto.membership.model.EmailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailDTO {

    private Long emailId;
    private EmailType type;
    private String address;
}
