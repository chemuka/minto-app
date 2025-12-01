package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "people")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 100)
    private String middleName;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private LifeStatus lifeStatus = LifeStatus.LIVING;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Owning side of the relationship
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "contact_id", unique = true)
    @ToString.Exclude
    @JsonManagedReference
    private Contact contact;

    // Bidirectional reference to application (optional, depending on your needs)
    @OneToOne(mappedBy = "person", fetch = FetchType.EAGER)
    @ToString.Exclude
    @JsonBackReference
    private Application application;

    // Helper methods to maintain bidirectional relationship with Contact
    public void setContact(Contact contact) {
        if (this.contact != null) {
            this.contact.setPerson(null);
        }
        this.contact = contact;
        if (contact != null) {
            contact.setPerson(this);
        }
    }

    // Convenience method to get full name
    public String getFullName() {
        StringBuilder name = new StringBuilder();
        name.append(firstName);
        if (middleName != null && !middleName.isEmpty()) {
            name.append(" ").append(middleName);
        }
        name.append(" ").append(lastName);

        return name.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person person)) return false;
        return id != null && id.equals(person.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
