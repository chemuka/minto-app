package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByPerson(Person person);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Application a WHERE a.person.id = :personId")
    boolean applicationExistsByPersonId(@Param("personId") Long personId);

    List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus);

    Optional<Application> findByApplicationNumber(String applicationNumber);

    //List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByPersonId(Long personId);

    List<Application> findBySubmittedDateBetween(LocalDateTime start, LocalDateTime end);

    List<Application> findByMaritalStatus(MaritalStatus maritalStatus);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.person p " +
            "LEFT JOIN FETCH p.contact " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithPersonAndContact(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.person " +
            "LEFT JOIN FETCH a.parents " +
            "LEFT JOIN FETCH a.spouses " +
            "LEFT JOIN FETCH a.children " +
            "LEFT JOIN FETCH a.siblings " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithFamily(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.beneficiaries " +
            "LEFT JOIN FETCH a.referees " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithBeneficiariesAndReferees(@Param("id") Long id);

    // Statistics queries
    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status")
    Long countByStatus(@Param("status") ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> getApplicationStatusCounts();
}
