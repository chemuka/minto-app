package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ContactDTO;
import com.pjdereva.minto.membership.model.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;


import java.util.List;

@Mapper(componentModel = "spring", uses = {AddressMapper.class, EmailMapper.class, PhoneMapper.class})
public interface ContactMapper {

    //ContactMapper INSTANCE = Mappers.getMapper(ContactMapper.class);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Contact toContact(ContactDTO contactDTO);

    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    ContactDTO toContactDTO(Contact contact);

    List<ContactDTO> toContactDTOs(List<Contact> contacts);

}
