package com.pjdereva.minto.membership.model.transaction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Application is created BY a User
 * Flow: User creates Application -> Application approved -> Member created
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ApplicationStatus applicationStatus = ApplicationStatus.DRAFT;

    // NEW: Application belongs to User (the applicant)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @JsonBackReference(value = "user-applications")
    private User user;

    // Primary applicant - owning side
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", unique = true, nullable = false)
    @ToString.Exclude
    @JsonManagedReference
    private Person person;

    // Member created from this application (optional - only after approval)
    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MaritalStatus maritalStatus;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Parent> parents = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Spouse> spouses = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Child> children = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Sibling> siblings = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Referee> referees = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Relative> relatives = new HashSet<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private Set<Beneficiary> beneficiaries = new HashSet<>();

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "rejected_date")
    private LocalDateTime rejectedDate;

    @Column(length = 2000)
    private String notes;

    @Column(length = 1000)
    private String rejectionReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime appCreatedAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime appUpdatedAt;

    // Helper methods to maintain bidirectional relationships
    public void addPerson(Person person) {
        this.person = person;
        person.setApplication(this);
    }

    public void addParent(Parent parent) {
        parents.add(parent);
        parent.setApplication(this);
    }

    public void removeParent(Parent parent) {
        parents.remove(parent);
        parent.setApplication(null);
    }

    public void addSpouse(Spouse spouse) {
        spouses.add(spouse);
        spouse.setApplication(this);
    }

    public void removeSpouse(Spouse spouse) {
        spouses.remove(spouse);
        spouse.setApplication(null);
    }

    public void addChild(Child child) {
        children.add(child);
        child.setApplication(this);
    }

    public void removeChild(Child child) {
        children.remove(child);
        child.setApplication(null);
    }

    public void addSibling(Sibling sibling) {
        siblings.add(sibling);
        sibling.setApplication(this);
    }

    public void removeSibling(Sibling sibling) {
        siblings.remove(sibling);
        sibling.setApplication(null);
    }

    public void addRelative(Relative relative) {
        relatives.add(relative);
        relative.setApplication(this);
    }

    public void removeRelative(Relative relative) {
        relatives.remove(relative);
        relative.setApplication(null);
    }

    public void addBeneficiary(Beneficiary beneficiary) {
        beneficiaries.add(beneficiary);
        beneficiary.setApplication(this);
    }

    public void removeBeneficiary(Beneficiary beneficiary) {
        beneficiaries.remove(beneficiary);
        beneficiary.setApplication(null);
    }

    public void addReferee(Referee referee) {
        referees.add(referee);
        referee.setApplication(this);
    }

    public void removeReferee(Referee referee) {
        referees.remove(referee);
        referee.setApplication(null);
    }

    // Business logic helpers
    public void submit() {
        this.applicationStatus = ApplicationStatus.SUBMITTED;
        this.submittedDate = LocalDateTime.now();
    }

    public void approve() {
        this.applicationStatus = ApplicationStatus.APPROVED;
        this.approvedDate = LocalDateTime.now();
    }

    public void reject(String reason) {
        this.applicationStatus = ApplicationStatus.REJECTED;
        this.rejectedDate = LocalDateTime.now();
        this.rejectionReason = reason;
    }

    public void returned() {
        this.applicationStatus = ApplicationStatus.RETURNED;
        this.submittedDate = null;
        this.approvedDate = null;
    }

    public boolean isEditable() {
        return applicationStatus == ApplicationStatus.DRAFT || applicationStatus == ApplicationStatus.RETURNED;
    }

    public boolean isSubmitted() {
        return submittedDate != null;
    }

    public boolean isApproved() {
        return applicationStatus == ApplicationStatus.APPROVED;
    }

    public boolean canConvertToMember() {
        return isApproved() && member == null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Application that)) return false;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
