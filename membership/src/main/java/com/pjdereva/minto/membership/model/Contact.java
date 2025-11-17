package com.pjdereva.minto.membership.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "contact", fetch = FetchType.LAZY)
    private Person person;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Address> addresses = new HashSet<>();

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Phone> phones = new HashSet<>();

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Email> emails = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods to maintain bidirectional relationships
    public void addAddress(Address address) {
        addresses.add(address);
        address.setContact(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setContact(null);
    }

    public void addPhone(Phone phone) {
        phones.add(phone);
        phone.setContact(this);
    }

    public void removePhone(Phone phone) {
        phones.remove(phone);
        phone.setContact(null);
    }

    public void addEmail(Email email) {
        emails.add(email);
        email.setContact(this);
    }

    public void removeEmail(Email email) {
        emails.remove(email);
        email.setContact(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Contact contact)) return false;
        return id != null && id.equals(contact.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
