package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TokenType {

    BEARER("Bearer");

    private final String label;

    TokenType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }
}
