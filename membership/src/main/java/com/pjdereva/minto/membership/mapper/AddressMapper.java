package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.AddressDTO;
import com.pjdereva.minto.membership.model.Address;
import com.pjdereva.minto.membership.model.AddressType;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    Address toAddress(AddressDTO addressDTO);

    AddressDTO toAddressDTO(Address address);

    List<AddressDTO> toAddressDTOs(List<Address> addresses);
    List<Address> toAddressList(List<AddressDTO> addressDTOList);
    Set<AddressDTO> addressSetToAddressDTOSet(Set<Address> addresses);
    Set<Address> addressDTOSetToAddressSet(Set<AddressDTO> addressDTOS);

    default String mapAddressTypeToLabel(AddressType addressType) {
        if(addressType == null) {
            return null;
        }
        return addressType.getLabel();
    }
}
