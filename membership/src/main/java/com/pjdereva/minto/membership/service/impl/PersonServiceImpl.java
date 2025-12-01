package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.PersonDTO;
import com.pjdereva.minto.membership.mapper.PersonMapper;
import com.pjdereva.minto.membership.model.Contact;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import com.pjdereva.minto.membership.repository.PersonRepository;
import com.pjdereva.minto.membership.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {
    
    private final PersonRepository personRepository;

    @Override
    public Optional<Person> createPerson(PersonDTO personDTO) {
        if(!personRepository.existsByFirstNameAndLastNameAndDob(personDTO.firstName(), personDTO.lastName(), LocalDate.parse(personDTO.dob()))){
            Person newPerson = Person.builder()
                    .firstName(personDTO.firstName())
                    .middleName(personDTO.middleName())
                    .lastName(personDTO.lastName())
                    .dob(LocalDate.parse(personDTO.dob()))
                    .lifeStatus(LifeStatus.valueOf(personDTO.lifeStatus()))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .contact(personDTO.contact())
                    .build();
            var savedPerson = personRepository.save(newPerson);
            return Optional.of(savedPerson);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public PersonDTO savePerson(PersonDTO personDTO) {
        var person = personRepository.save(PersonMapper.INSTANCE.toPerson(personDTO));
        return PersonMapper.INSTANCE.toPersonDTO(person);
    }

    @Override
    public List<Person> getAllPeople() {
        return personRepository.findAllWithFullContact();
    }

    @Override
    public Optional<Person> getPersonById(Long id) {
        return personRepository.findByIdWithFullContact(id);
    }

    @Override
    public boolean existById(Long id) {
        return personRepository.existsById(id);
    }

    @Override
    public Person updatePerson(Person person) {
        person.setUpdatedAt(LocalDateTime.now());
        return personRepository.save(person);
    }

    @Override
    public boolean deletePersonById(Long id) {
        try {
            personRepository.deleteById(id);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public PersonDTO updatePersonById(Long id, Map<String, Object> updates) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (personOptional.isPresent()) {
            Person person = personOptional.get();
            // Update person fields based on the provided updates
            if (updates.containsKey("firstName")) {
                person.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("middleName")) {
                person.setMiddleName((String) updates.get("middleName"));
            }
            if (updates.containsKey("lastName")) {
                person.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("dob")) {
                person.setDob((LocalDate) updates.get("dob"));
            }
            if (updates.containsKey("lifeStatus")) {
                person.setLifeStatus(LifeStatus.valueOf((String) updates.get("lifeStatus")));
            }
            if (updates.containsKey("contact")) {
                person.setContact((Contact) updates.get("contact"));
            }
            person.setUpdatedAt(LocalDateTime.now());
            return PersonMapper.INSTANCE.toPersonDTO(personRepository.save(person));
        }
        return null;
    }
}
