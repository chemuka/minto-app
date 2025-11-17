package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonValue;
import com.pjdereva.minto.membership.model.transaction.SiblingType;

import java.util.Arrays;

public enum PhoneType {
    MOBILE("Mobile"),
    HOME("Home"),
    WORK("Work"),
    SCHOOL("School"),
    OTHER("Other");

    private final String label;

    PhoneType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static PhoneType fromLabel(String label) {
        return Arrays.stream(PhoneType.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
