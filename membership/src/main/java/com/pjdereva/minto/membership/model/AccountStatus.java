package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AccountStatus {
    ACTIVE("Active"),
    SUSPENDED("Suspended"),
    LOCKED("Locked"),
    EXPIRED("Expired"),
    PENDING_VERIFICATION("Pending verification");

    private final String label;

    AccountStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static AccountStatus fromLabel(String label) {
        return Arrays.stream(AccountStatus.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
