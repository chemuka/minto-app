package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailRepository extends JpaRepository<Email, Long> {

    List<Email> findByContactId(Long contactId);
    Optional<Email> findByAddress(String address);
}
