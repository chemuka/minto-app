package com.pjdereva.minto.membership.exception;

public class PersonIdNotFoundException extends RuntimeException {

    public PersonIdNotFoundException(Long id) {
        super("Could not find person with person_id: " + id);
    }
}
