package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByCompanyContainingIgnoreCase(String company);

    @Query("SELECT c FROM Contact c JOIN c.emails e WHERE e.address = :email")
    Optional<Contact> findByEmailAddress(@Param("email") String email);

    @Query("SELECT c FROM Contact c JOIN c.phones p WHERE p.number = :phone")
    Optional<Contact> findByPhoneNumber(@Param("phone") String phone);
}
