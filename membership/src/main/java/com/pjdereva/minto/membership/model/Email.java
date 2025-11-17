package com.pjdereva.minto.membership.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "emails")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    @ToString.Exclude
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmailType type;

    @Column(nullable = false, length = 255)
    private String address;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email email)) return false;
        return id != null && id.equals(email.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
