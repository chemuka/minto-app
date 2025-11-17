package com.pjdereva.minto.membership.model.transaction;

import com.pjdereva.minto.membership.model.Person;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "relatives")
public class Relative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @ToString.Exclude
    private Application application;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", unique = true)
    @ToString.Exclude
    private Person person;

    private String membershipNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private FamilyRelationship relationship;

    @Column(length = 500)
    private String notes;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Relative relative)) return false;
        return id != null && id.equals(relative.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
