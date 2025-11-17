package com.pjdereva.minto.membership.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "phones")
public class Phone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    @ToString.Exclude
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PhoneType type;

    @Column(nullable = false, length = 20)
    private String number;

    @Column(length = 10)
    private String countryCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Phone phone)) return false;
        return id != null && id.equals(phone.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
