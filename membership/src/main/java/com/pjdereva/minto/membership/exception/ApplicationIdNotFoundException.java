package com.pjdereva.minto.membership.exception;

public class ApplicationIdNotFoundException extends RuntimeException {
    public ApplicationIdNotFoundException(Long id) {
        super("Could not find application with application_id: " + id);
    }
}
