package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ParentDTO;
import com.pjdereva.minto.membership.model.transaction.Parent;
import com.pjdereva.minto.membership.model.transaction.ParentType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {PersonMapper.class})
public interface ParentMapper {

    //ParentMapper INSTANCE = Mappers.getMapper(ParentMapper.class);
    /*
    @Mapping(target = "person.firstName", source = "parentDTO.firstName")
    @Mapping(target = "person.middleName", source = "parentDTO.middleName")
    @Mapping(target = "person.lastName", source = "parentDTO.lastName")
    @Mapping(target = "person.dob", source = "parentDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "parentDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "parentDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "parentDTO.updatedAt")
    @Mapping(target = "person.contact", source = "parentDTO.contact")
    @Mapping(target = "application", ignore = true) */
    Parent toParent(ParentDTO parentDTO);
    /*
    @Mapping(target = "firstName", source = "parent.person.firstName")
    @Mapping(target = "middleName", source = "parent.person.middleName")
    @Mapping(target = "lastName", source = "parent.person.lastName")
    @Mapping(target = "dob", source = "parent.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "parent.person.lifeStatus")
    @Mapping(target = "createdAt", source = "parent.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "parent.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "parent.person.contact") */
    ParentDTO toParentDTO(Parent parent);

    List<ParentDTO> toParentDTOs(List<Parent> parents);
    Set<ParentDTO> parentSetToParentDTOSet(Set<Parent> parents);
    Set<Parent> parentDTOSetToParentSet(Set<ParentDTO> parentDTOS);

    default String mapParentTypeToLabel(ParentType parentType) {
        if(parentType == null) {
            return null;
        }
        return parentType.getLabel();
    }
}
