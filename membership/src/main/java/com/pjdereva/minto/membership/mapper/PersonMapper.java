package com.pjdereva.minto.membership.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjdereva.minto.membership.dto.PersonDTO;
import com.pjdereva.minto.membership.model.Contact;
import com.pjdereva.minto.membership.model.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

    @Mapping(target = "id", ignore = true)
    Person toPerson(PersonDTO personDTO);

    @Mapping(target = "dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    PersonDTO toPersonDTO(Person person);

    List<PersonDTO> toPersonDTOs(List<Person> people);

}
