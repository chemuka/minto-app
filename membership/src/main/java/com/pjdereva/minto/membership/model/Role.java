package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    USER("User"),
    MEMBER("Member"),
    STAFF("Staff"),
    ADMIN("Admin");

    private final String label;

    Role(String label) {
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
