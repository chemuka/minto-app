package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.model.transaction.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByUserIdOrApplicationId(Long userId, Long applicationId);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Member m WHERE m.userId = :userId OR m.application.id = :applicationId")
    boolean memberExistsByUserIdOrApplicationId(@Param("userId") Long userId, @Param("applicationId") Long applicationId);

    Optional<Member> findByUserId(Long userId);

    // Find by membership number
    Optional<Member> findByMembershipNumber(String membershipNumber);

    // Find by person
    Optional<Member> findByPersonId(Long personId);

    // Find by application
    Optional<Member> findByApplicationId(Long applicationId);

    // Check if membership exists for application
    boolean existsByApplicationId(Long applicationId);

    // Find by status
    List<Member> findByStatus(MembershipStatus status);

    // Count by status
    Long countByStatus(MembershipStatus status);

    // Find expiring memberships
    List<Member> findByEndDateBetweenAndStatus(
            LocalDate startDate,
            LocalDate endDate,
            MembershipStatus status
    );

    // Find expired memberships that are still marked as active
    List<Member> findByEndDateBeforeAndStatus(
            LocalDate date,
            MembershipStatus status
    );

    // Find members with overdue payments
    List<Member> findByNextPaymentDueBeforeAndFeePaidFalse(LocalDate date);

    // Find members by start date range
    List<Member> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    // Complex queries with person details
    @Query("SELECT m FROM Member m " +
            "LEFT JOIN FETCH m.person p " +
            "LEFT JOIN FETCH p.contact c " +
            "LEFT JOIN FETCH c.emails " +
            "LEFT JOIN FETCH c.phones " +
            "WHERE m.id = :id")
    Optional<Member> findByIdWithPersonAndContact(@Param("id") Long id);

    @Query("SELECT m FROM Member m " +
            "LEFT JOIN FETCH m.person p " +
            "LEFT JOIN FETCH m.application " +
            "WHERE m.membershipNumber = :membershipNumber")
    Optional<Member> findByMembershipNumberWithDetails(@Param("membershipNumber") String membershipNumber);

    // Search members by name
    @Query("SELECT m FROM Member m " +
            "JOIN m.person p " +
            "WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(m.membershipNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Member> searchMembers(@Param("searchTerm") String searchTerm);

    // Active members only
    @Query("SELECT m FROM Member m WHERE m.status = 'ACTIVE' ORDER BY m.startDate DESC")
    List<Member> findAllActiveMembers();

    // Statistics queries
    //@Query("SELECT m.type, COUNT(m) FROM Member m WHERE m.status = 'ACTIVE' GROUP BY m.type")
    //List<Object[]> getActiveMemberCountByType();

    @Query("SELECT m.feesPaid, COUNT(m) FROM Member m WHERE m.status = 'ACTIVE' GROUP BY m.feesPaid")
    List<Object[]> getActiveMemberCount();

    @Query("SELECT m.status, COUNT(m) FROM Member m GROUP BY m.status")
    List<Object[]> getMemberCountByStatus();
}
