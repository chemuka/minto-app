package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ParentType {
    BIOLOGICAL_MOTHER("Biological Mother"),
    BIOLOGICAL_FATHER("Biological Father"),
    ADOPTIVE_MOTHER("Adoptive Mother"),
    ADOPTIVE_FATHER("Adoptive Father"),
    STEP_MOTHER("Step Mother"),
    STEP_FATHER("Step Father"),
    FOSTER_MOTHER("Foster Mother"),
    FOSTER_FATHER("Foster Father"),
    GUARDIAN("Guardian");

    private final String label;

    ParentType(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static ParentType fromLabel(String label) {
        return Arrays.stream(ParentType.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
