package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ApplicationStatus {
    DRAFT("Draft"),
    SUBMITTED("Submitted"),
    UNDER_REVIEW("Under review"),
    RETURNED("Returned"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    WITHDRAWN("Withdrawn");

    private final String label;

    ApplicationStatus(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static ApplicationStatus fromLabel(String label) {
        return Arrays.stream(ApplicationStatus.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
