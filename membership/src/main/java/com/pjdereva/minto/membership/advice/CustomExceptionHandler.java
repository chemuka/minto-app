package com.pjdereva.minto.membership.advice;

import com.pjdereva.minto.membership.payload.response.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException ex, WebRequest request) {
        // Create a custom error response
        ErrorResponse error = ErrorResponse
                .builder()
                .message("JWT Expired: The provided JWT token has expired.")
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .build();

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
