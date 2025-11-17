package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RegistrationSource {
    AUTH0("Auth0"),
    DASHBOARD("Local Dashboard"),
    FACEBOOK("Facebook"),
    GITHUB("GitHub"),
    GOOGLE("Google"),
    KEYCLOAK("Keycloak"),
    MS_ENTRA("Microsoft Entra ID"),
    OKTA("Okta"),
    SIGNUP("Local Sign Up");

    private final String label;

    RegistrationSource(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }
}
