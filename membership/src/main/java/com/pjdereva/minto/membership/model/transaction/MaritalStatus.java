package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum MaritalStatus {
    SINGLE("Single (Never Married)"),
    MARRIED("Married"),
    LIVING_COMMON_LAW("Living Common-Law"),
    SEPARATED("Separated"),
    DIVORCED("Divorced"),
    WIDOWED("Widowed"),
    OTHER("Other");

    private final String label;

    MaritalStatus(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static MaritalStatus fromLabel(String label) {
        return Arrays.stream(MaritalStatus.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString(){
        return label;
    }
}
