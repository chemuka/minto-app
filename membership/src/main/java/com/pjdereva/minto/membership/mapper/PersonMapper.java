package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = { ContactMapper.class })
public interface PersonMapper {

    //PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Person toPerson(PersonDTO personDTO);

    @Mapping(target = "dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    PersonDTO toPersonDTO(Person person);

    List<PersonDTO> toPersonDTOs(List<Person> people);
    Set<PersonDTO> personSetToPersonDTOSet(Set<Person> people);
    Set<Person> personDTOSetToPersonSet(Set<PersonDTO> personDTOS);

    default String mapLifeStatusToLabel(LifeStatus lifeStatus) {
        if(lifeStatus == null) {
            return null;
        }
        return lifeStatus.getLabel();
    }
}
