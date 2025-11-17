package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Spouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpouseRepository extends JpaRepository<Spouse, Long> {

    List<Spouse> findByApplicationId(Long applicationId);

    @Query("SELECT s FROM Spouse s " +
            "LEFT JOIN FETCH s.person p " +
            "LEFT JOIN FETCH p.contact " +
            "WHERE s.application.id = :applicationId")
    List<Spouse> findByApplicationIdWithPersonAndContact(@Param("applicationId") Long applicationId);
}
