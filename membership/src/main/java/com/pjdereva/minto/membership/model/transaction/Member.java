package com.pjdereva.minto.membership.model.transaction;

import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String membershipNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MembershipStatus status = MembershipStatus.ACTIVE;

    // NEW: Member belongs to User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @ToString.Exclude
    private User user;

    // Link to the person (same person as in application)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", unique = true, nullable = false)
    @ToString.Exclude
    private Person person;

    // Reference to the approved application that created this membership
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", unique = true, nullable = false)
    @ToString.Exclude
    private Application application;

    // Membership dates
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    // Financial information
    @Column(name = "membership_fee", precision = 10, scale = 2)
    private BigDecimal membershipFee;

    @Column(name = "last_payment_date")
    private LocalDate lastPaymentDate;

    @Column(name = "next_payment_due")
    private LocalDate nextPaymentDue;

    @Column(name = "is_fee_paid")
    @Builder.Default
    private boolean feePaid = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime memberCreatedAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime memberUpdatedAt;

    @Column(length = 2000)
    private String notes;

    @Column(length = 1000)
    private String terminationReason;

    // Business logic methods
    public void activate() {
        this.status = MembershipStatus.ACTIVE;
        if (this.startDate == null) {
            this.startDate = LocalDate.now();
        }
    }

    public void suspend(String reason) {
        this.status = MembershipStatus.SUSPENDED;
        this.notes = (this.notes != null ? this.notes + "\n" : "") +
                "Suspended: " + reason;
    }

    public void terminate(String reason) {
        this.status = MembershipStatus.TERMINATED;
        this.terminationDate = LocalDate.now();
        this.terminationReason = reason;
    }

    public void renew(LocalDate newEndDate) {
        this.status = MembershipStatus.ACTIVE;
        this.renewalDate = LocalDate.now();
        this.endDate = newEndDate;
    }

    public boolean isActive() {
        return status == MembershipStatus.ACTIVE;
    }

    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }

    public boolean isExpiringSoon(int days) {
        if (endDate == null) return false;
        return endDate.isBefore(LocalDate.now().plusDays(days)) &&
                endDate.isAfter(LocalDate.now());
    }

    public long getDaysUntilExpiry() {
        if (endDate == null) return -1;
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), endDate);
    }

    public boolean requiresPayment() {
        return !feePaid || (nextPaymentDue != null &&
                nextPaymentDue.isBefore(LocalDate.now()));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Member member)) return false;
        return id != null && id.equals(member.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
