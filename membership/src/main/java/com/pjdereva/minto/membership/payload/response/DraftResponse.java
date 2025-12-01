package com.pjdereva.minto.membership.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DraftResponse {

    private boolean success;
    private String message;
    private Long applicationId;
    private String applicationNumber;
}
