package com.pjdereva.minto.membership.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.model.transaction.MembershipStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * User is the PRIMARY entity - created FIRST when someone registers
 * Flow: User (Guest) -> Application -> Member
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false)
    private String password;

    private String picture;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, updatable = true)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RegistrationSource source;

    // NEW FLOW: User owns Person (created during registration)
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", unique = true)
    @ToString.Exclude
    private Person person;

    // User can have multiple applications (reapply if rejected)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference(value = "user-applications")
    private Set<Application> applications = new HashSet<>();

    // User becomes a Member after application approval (optional)
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @ToString.Exclude
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        //return UserDetails.super.isAccountNonExpired();
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        if (accountLockedUntil != null) {
            return accountLockedUntil.isBefore(LocalDateTime.now());
        }
        return accountStatus != AccountStatus.LOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        //return UserDetails.super.isCredentialsNonExpired();
        return true;
    }

    @Override
    public boolean isEnabled() {
        //return UserDetails.super.isEnabled();
        return true;
    }

    // Business logic methods
    public void recordSuccessfulLogin() {
        this.lastLogin = LocalDateTime.now();
        this.failedLoginAttempts = 0;
        this.accountLockedUntil = null;
    }

    public void recordFailedLogin() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 5) {
            this.accountLockedUntil = LocalDateTime.now().plusHours(1);
        }
    }

    public void lockAccount() {
        this.accountStatus = AccountStatus.LOCKED;
    }

    public void unlockAccount() {
        this.accountStatus = AccountStatus.ACTIVE;
        this.failedLoginAttempts = 0;
        this.accountLockedUntil = null;
    }

    // Helper methods for applications
    public void addApplication(Application application) {
        applications.add(application);
        application.setUser(this);
    }

    public void removeApplication(Application application) {
        applications.remove(application);
        application.setUser(null);
    }

    public void upgradeToMember() {
        if(isGuest()) {
            role = Role.MEMBER;
        }
        // Remove ROLE_GUEST if present
        //roles.removeIf(role -> role.getName().equals("ROLE_GUEST"));
        // ROLE_MEMBER will be added when Member entity is created
    }

    // Status checks
    public boolean isGuest() {
        return role.equals(Role.USER);
    }

    public boolean isMember() {
        return member != null && member.isActive();
    }

    public boolean isStaff() {
        return role.equals(Role.STAFF);
    }

    public boolean isAdmin() {
        return role.equals(Role.ADMIN);
    }

    public boolean canApply() {
        // Guests can apply, members cannot reapply unless terminated
        return isGuest() || (member != null && member.getStatus() == MembershipStatus.TERMINATED);
    }

    public boolean hasActiveApplication() {
        return applications.stream()
                .anyMatch(app -> app.getApplicationStatus() == ApplicationStatus.SUBMITTED ||
                        app.getApplicationStatus() == ApplicationStatus.UNDER_REVIEW);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
