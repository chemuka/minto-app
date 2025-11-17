package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByApplicationId(Long applicationId);

    List<Beneficiary> findByApplicationIdAndRelationship(Long applicationId, String relationship);

    @Query("SELECT SUM(b.percentage) FROM Beneficiary b WHERE b.application.id = :applicationId")
    java.math.BigDecimal getTotalPercentageByApplicationId(@Param("applicationId") Long applicationId);

    @Query("SELECT b FROM Beneficiary b " +
            "LEFT JOIN FETCH b.person p " +
            "LEFT JOIN FETCH p.contact " +
            "WHERE b.application.id = :applicationId " +
            "ORDER BY b.percentage DESC")
    List<Beneficiary> findByApplicationIdOrderedByPriority(@Param("applicationId") Long applicationId);
}
