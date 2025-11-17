package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParentRepository extends JpaRepository<Parent, Long> {

    List<Parent> findByApplicationId(Long applicationId);

    List<Parent> findByApplicationIdAndLiving(Long applicationId, boolean living);

    @Query("SELECT p FROM Parent p " +
            "LEFT JOIN FETCH p.person " +
            "WHERE p.application.id = :applicationId")
    List<Parent> findByApplicationIdWithPerson(@Param("applicationId") Long applicationId);
}
