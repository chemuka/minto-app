package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum LifeStatus {

    LIVING("Living"),
    DECEASED("Deceased"),
    UNKNOWN("Unknown");

    private final String label;

    LifeStatus(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static LifeStatus fromLabel(String label) {
        return Arrays.stream(LifeStatus.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
