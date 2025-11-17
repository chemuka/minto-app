package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, Long> {

    List<Child> findByApplicationId(Long applicationId);

    @Query("SELECT c FROM Child c " +
            "LEFT JOIN FETCH c.person " +
            "WHERE c.application.id = :applicationId " +
            "ORDER BY c.person.dob")
    List<Child> findByApplicationIdOrderedByAge(@Param("applicationId") Long applicationId);
}
