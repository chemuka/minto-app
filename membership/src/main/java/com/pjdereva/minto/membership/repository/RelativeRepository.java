package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.transaction.Relative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.management.relation.RelationType;
import java.util.List;

public interface RelativeRepository extends JpaRepository<Relative, Long> {

    List<Relative> findByApplicationId(Long applicationId);

    List<Relative> findByApplicationIdAndType(Long applicationId, RelationType type);

    @Query("SELECT r FROM Relative r " +
            "LEFT JOIN FETCH r.person p " +
            "LEFT JOIN FETCH p.contact " +
            "WHERE r.application.id = :applicationId")
    List<Relative> findByApplicationIdWithPersonAndContact(@Param("applicationId") Long applicationId);
}
