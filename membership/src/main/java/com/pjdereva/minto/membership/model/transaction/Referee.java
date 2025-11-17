package com.pjdereva.minto.membership.model.transaction;

import com.pjdereva.minto.membership.model.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "referees")
public class Referee {

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

    @Column(name = "reference_date")
    private LocalDate referenceDate;

    @Column(name = "is_contacted")
    private boolean contacted;

    @Column(length = 2000)
    private String comments;

    @Column(length = 500)
    private String notes;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Referee referee)) return false;
        return id != null && id.equals(referee.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
