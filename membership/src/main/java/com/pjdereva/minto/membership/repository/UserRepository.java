package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.AccountStatus;
import com.pjdereva.minto.membership.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Basic lookups
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Member and Person relationships
    Optional<User> findByMemberId(Long memberId);
    Optional<User> findByPersonId(Long personId);

    // Status-based queries
    List<User> findByAccountStatus(AccountStatus status);

    @Query("SELECT u FROM User u WHERE u.accountLockedUntil < CURRENT_TIMESTAMP")
    List<User> findAccountsReadyForUnlock();

    // Role-based queries
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    // Member users only
    @Query("SELECT u FROM User u WHERE u.member IS NOT NULL")
    List<User> findAllMemberUsers();

    // Staff users only (users without member)
    @Query("SELECT u FROM User u WHERE u.member IS NULL")
    List<User> findAllStaffUsers();

    // Complex query with full details
    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.role " +
            "LEFT JOIN FETCH u.person " +
            "LEFT JOIN FETCH u.member " +
            "WHERE u.id = :id")
    Optional<User> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.role r " +
            "WHERE u.email = :email")
    Optional<User> findByEmailWithRolesAndPermissions(@Param("email") String email);

    // Active member users
    @Query("SELECT u FROM User u " +
            "JOIN u.member m " +
            "WHERE m.status = 'ACTIVE' " +
            "AND u.accountStatus = 'ACTIVE'")
    List<User> findAllActiveMemberUsers();

    // Search
    @Query("SELECT u FROM User u " +
            "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(U.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
}
