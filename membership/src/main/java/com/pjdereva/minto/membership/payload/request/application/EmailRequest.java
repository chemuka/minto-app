package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.EmailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailRequest {

    private EmailType type;
    private String address;
}
