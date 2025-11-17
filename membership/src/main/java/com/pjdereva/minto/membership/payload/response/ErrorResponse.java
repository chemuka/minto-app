package com.pjdereva.minto.membership.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ErrorResponse {

    private String message;
    private int statusCode;
}
