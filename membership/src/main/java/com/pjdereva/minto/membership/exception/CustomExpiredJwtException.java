package com.pjdereva.minto.membership.exception;

public class CustomExpiredJwtException extends RuntimeException{

    public CustomExpiredJwtException(String message){
        super(message);
    }
}
