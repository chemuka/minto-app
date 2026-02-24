package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.exception.PersonNotFoundException;
import com.pjdereva.minto.membership.mapper.PersonMapper;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.service.impl.PersonServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
@RequestMapping("/api/v1/people")
public class PersonController {

    private final PersonServiceImpl personService;
    private final PersonMapper personMapper;

    @GetMapping
    public ResponseEntity<List<Person>> getAllPeople() {
        List<Person> people = personService.getAllPeople();
        return ResponseEntity.ok(people);
    }

    @GetMapping("/dto")
    public ResponseEntity<List<PersonDTO>> getAllPeopleDTO() {
        List<Person> people = personService.getAllPeople();
        return ResponseEntity.ok(personMapper.toPersonDTOs(people));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        Optional<Person> person = personService.getPersonById(id);
        return person.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseThrow(() -> new PersonNotFoundException(id));
    }

    @PostMapping
    public ResponseEntity<?> createPerson(@RequestBody PersonDTO personDTO) {
        Optional<Person> person = Optional.empty();
        try {
            person = personService.createPerson(personDTO);
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok(person);
    }

    @PutMapping
    public ResponseEntity<Person> updatePerson(
            @RequestBody Person person,
            Principal principal) {
        var newPerson = personService.updatePerson(person);
        return ResponseEntity.ok(newPerson);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePersonById(@PathVariable Long id, @RequestBody Person person) {
        return personService.getPersonById(id).map(existingPerson -> {
                    existingPerson.setFirstName(person.getFirstName());
                    existingPerson.setMiddleName(person.getMiddleName());
                    existingPerson.setLastName(person.getLastName());
                    existingPerson.setDob(person.getDob());
                    existingPerson.setLifeStatus(person.getLifeStatus());
                    existingPerson.setContact(person.getContact());
                    existingPerson.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(personService.updatePerson(existingPerson));
                }).orElseThrow(() -> new PersonNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserByEmail(@PathVariable Long id) {
        if(!personService.existById(id)) {
            return ResponseEntity.badRequest()
                    .body("Error: Person with id: " + id + " does not exist.");
        }
        boolean response = false;
        try {
            response = personService.deletePersonById(id);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        if(response)
            return ResponseEntity.ok("Person with id " + id + " has been deleted successfully.");
        else
            return ResponseEntity.unprocessableEntity().body("Error: Something went wrong in the database!");
    }
}
