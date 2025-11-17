package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Sibling;
import com.pjdereva.minto.membership.model.transaction.SiblingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SiblingRepository extends JpaRepository<Sibling, Long> {

    List<Sibling> findByApplicationId(Long applicationId);

    List<Sibling> findByApplicationIdAndType(Long applicationId, SiblingType type);

    @Query("SELECT s FROM Sibling s " +
            "LEFT JOIN FETCH s.person " +
            "WHERE s.application.id = :applicationId")
    List<Sibling> findByApplicationIdWithPerson(@Param("applicationId") Long applicationId);
}
