package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.pjdereva.minto.membership.model.Person;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "parents")
public class Parent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    @ToString.Exclude
    @JsonBackReference
    private Application application;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id", unique = true)
    @ToString.Exclude
    private Person person;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ParentType parentType;

    @Column(length = 500)
    private String notes;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Parent parent)) return false;
        return id != null && id.equals(parent.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
