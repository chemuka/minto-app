package com.pjdereva.minto.membership.payload.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AutoSaveResponse {

    private boolean success;
    private LocalDateTime savedAt;
    private Long applicationId;
    private String error;
}
