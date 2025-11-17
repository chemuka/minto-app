package com.pjdereva.minto.membership.exception;

public class UserEmailNotFoundException extends RuntimeException {

    public UserEmailNotFoundException(String email) {
        super("Could not find user with email address: " + email);
    }
}
