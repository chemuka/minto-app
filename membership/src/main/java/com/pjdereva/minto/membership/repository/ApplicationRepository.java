package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.User;
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

    List<Application> findAllByUser(User user);

    List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus);

    List<Application> findAllByApplicationStatusIn(List<ApplicationStatus> applicationStatuses);

    Optional<Application> findByApplicationNumber(String applicationNumber);

    //List<Application> findByApplicationStatus(ApplicationStatus applicationStatus);

    Optional<Application> findByUserIdAndApplicationStatus(Long userId, ApplicationStatus applicationStatus);

    Optional<Application> findByPersonId(Long personId);

    List<Application> findBySubmittedDateBetween(LocalDateTime start, LocalDateTime end);

    List<Application> findByMaritalStatus(MaritalStatus maritalStatus);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH u.person p " +
            "LEFT JOIN FETCH p.contact c " +
            "LEFT JOIN FETCH c.addresses " +
            "LEFT JOIN FETCH c.phones " +
            "LEFT JOIN FETCH c.emails " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithPersonAndContact(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.person " +
            "LEFT JOIN FETCH a.parents " +
            "LEFT JOIN FETCH a.spouses " +
            "LEFT JOIN FETCH a.children " +
            "LEFT JOIN FETCH a.siblings " +
            "LEFT JOIN FETCH a.relatives " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithFamily(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.beneficiaries " +
            "LEFT JOIN FETCH a.referees " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithBeneficiariesAndReferees(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
            "LEFT JOIN FETCH a.person " +
            "LEFT JOIN FETCH a.parents " +
            "LEFT JOIN FETCH a.spouses " +
            "LEFT JOIN FETCH a.children " +
            "LEFT JOIN FETCH a.siblings " +
            "LEFT JOIN FETCH a.referees " +
            "LEFT JOIN FETCH a.relatives " +
            "LEFT JOIN FETCH a.beneficiaries " +
            "WHERE a.id = :id")
    Optional<Application> findByIdWithAllPeople(@Param("id") Long id);


    // Statistics queries
    @Query("SELECT COUNT(a) FROM Application a WHERE a.applicationStatus = :applicationStatus")
    Long countByApplicationStatus(@Param("applicationStatus") ApplicationStatus applicationStatus);

    @Query("SELECT a.applicationStatus, COUNT(a) FROM Application a GROUP BY a.applicationStatus")
    List<Object[]> getApplicationStatusCounts();
}
