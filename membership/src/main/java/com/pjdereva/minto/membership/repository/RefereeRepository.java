package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Referee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RefereeRepository extends JpaRepository<Referee, Long> {

    List<Referee> findByApplicationId(Long applicationId);

    List<Referee> findByApplicationIdAndContacted(Long applicationId, boolean contacted);

    @Query("SELECT r FROM Referee r " +
            "WHERE r.application.id = :applicationId " +
            "AND r.contacted = false")
    List<Referee> findPendingRefereesByApplicationId(@Param("applicationId") Long applicationId);

    @Query("SELECT r FROM Referee r " +
            "LEFT JOIN FETCH r.person p " +
            "LEFT JOIN FETCH p.contact c " +
            "LEFT JOIN FETCH c.phones " +
            "LEFT JOIN FETCH c.emails " +
            "WHERE r.application.id = :applicationId")
    List<Referee> findByApplicationIdWithFullContact(@Param("applicationId") Long applicationId);
}
