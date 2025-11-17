package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum MembershipStatus {
    ACTIVE("Active"),
    SUSPENDED("Suspended"),
    EXPIRED("Expired"),
    TERMINATED("Terminated"),
    PENDING_RENEWAL("Pending renewal");

    private final String label;

    MembershipStatus(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static MembershipStatus fromLabel(String label) {
        return Arrays.stream(MembershipStatus.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
