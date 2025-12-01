package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {

    boolean existsByFirstNameAndLastNameAndDob(String firstName, String lastName, LocalDate dob);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Person p WHERE p.firstName = :firstName AND p.lastName = :lastName AND p.dob = :dob")
    boolean personExistsByFirstNameAndLastNameAndDob(@Param("firstName") String firstName, @Param("lastName") String lastName, @Param("dob") LocalDate dob);

    List<Person> findByFirstNameAndLastName(String firstName, String lastName);

    List<Person> findByLifeStatus(LifeStatus lifeStatus);

    List<Person> findByDobBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Person p LEFT JOIN FETCH p.contact c " +
            "LEFT JOIN FETCH c.addresses " +
            "LEFT JOIN FETCH c.phones " +
            "LEFT JOIN FETCH c.emails " +
            "WHERE p.id = :id")
    Optional<Person> findByIdWithFullContact(@Param("id") Long id);

    @Query("SELECT p FROM Person p LEFT JOIN FETCH p.contact c " +
            "LEFT JOIN FETCH c.addresses " +
            "LEFT JOIN FETCH c.phones " +
            "LEFT JOIN FETCH c.emails ")
    List<Person> findAllWithFullContact();

    @Query("SELECT p FROM Person p WHERE " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.middleName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Person> searchByName(@Param("searchTerm") String searchTerm);
}
