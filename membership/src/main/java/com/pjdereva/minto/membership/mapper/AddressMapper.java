package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.AddressDTO;
import com.pjdereva.minto.membership.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    AddressMapper INSTANCE = Mappers.getMapper(AddressMapper.class);

    Address toAddress(AddressDTO addressDTO);

    AddressDTO toAddressDTO(Address address);

    List<AddressDTO> toAddressDTOs(List<Address> addresses);
}
