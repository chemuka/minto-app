package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Phone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhoneRepository extends JpaRepository<Phone, Long> {

    List<Phone> findByContactId(Long contactId);
    List<Phone> findByNumber(String number);
}
