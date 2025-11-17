package com.pjdereva.minto.membership.exception;

public class UserIdNotFoundException extends RuntimeException{

    public UserIdNotFoundException(Long id) {
        super("Could not find user with user_id: " + id);
    }
}
