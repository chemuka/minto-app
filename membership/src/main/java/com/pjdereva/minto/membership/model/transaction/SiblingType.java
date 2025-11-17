package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum SiblingType {
    BROTHER("Brother"),
    SISTER("Sister"),
    STEP_BROTHER("Step Brother"),
    STEP_SISTER("Step Sister"),
    ADOPTED_BROTHER("Adopted Brother"),
    ADOPTED_SISTER("Adopted Sister"),
    OTHER("Other");

    private final String label;

    SiblingType(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static SiblingType fromLabel(String label) {
        return Arrays.stream(SiblingType.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
