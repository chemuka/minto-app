package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.PersonDTO;
import com.pjdereva.minto.membership.model.Person;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PersonService {

    Optional<Person> createPerson(PersonDTO personDTO);
    PersonDTO savePerson(PersonDTO person);
    List<Person> getAllPeople();
    Optional<Person> getPersonById(Long id);
    boolean existById(Long id);
    Person updatePerson(Person person);
    boolean deletePersonById(Long id);

    PersonDTO updatePersonById(Long id, Map<String, Object> updates);
}
