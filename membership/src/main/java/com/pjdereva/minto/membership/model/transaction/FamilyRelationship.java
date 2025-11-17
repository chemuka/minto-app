package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum FamilyRelationship {
    FATHER("Father"),
    MOTHER("Mother"),
    SON("Son"),
    DAUGHTER("Daughter"),
    BROTHER("Brother"),
    SISTER("Sister"),
    GRANDFATHER("Grandfather"),
    GRANDMOTHER("Grandmother"),
    GRANDSON("Grandson"),
    GRANDDAUGHTER("Granddaughter"),
    UNCLE("Uncle"),
    AUNT("Aunt"),
    NEPHEW("Nephew"),
    NIECE("Niece"),
    COUSIN("Cousin"),
    GREAT_GRANDFATHER("Great-Grandfather"),
    GREAT_GRANDMOTHER("Great-Grandmother"),
    GREAT_UNCLE("Great-Uncle"),
    GREAT_AUNT("Great-Aunt"),
    SPOUSE("Spouse"),
    STEP_RELATIVE("Step relative"),
    OTHER("Other");

    private final String label;

    FamilyRelationship(String label){
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static FamilyRelationship fromLabel(String label) {
        return Arrays.stream(FamilyRelationship.values())
                .filter(e -> e.getLabel().equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No enum constant with label: " + label));
    }

    @Override
    public String toString() {
        return label;
    }
}
