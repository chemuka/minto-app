package com.pjdereva.minto.membership.exception;

public class PersonNotFoundException extends RuntimeException{

    public PersonNotFoundException(Long id) {
        super("Could not find the person with id " + id);
    }
}
