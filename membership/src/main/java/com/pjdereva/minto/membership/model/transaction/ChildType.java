package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum ChildType {
    BIOLOGICAL("Biological"),
    ADOPTED("Adopted"),
    STEP_CHILD("Step Child"),
    FOSTER_CHILD("Foster Child");

    private final String label;

    ChildType(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static ChildType fromLabel(String label) {
        return Arrays.stream(ChildType.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
