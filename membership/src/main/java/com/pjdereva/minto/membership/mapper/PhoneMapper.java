package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.EmailDTO;
import com.pjdereva.minto.membership.dto.application.PhoneDTO;
import com.pjdereva.minto.membership.model.Phone;
import com.pjdereva.minto.membership.model.PhoneType;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface PhoneMapper {

    //PhoneMapper INSTANCE = Mappers.getMapper(PhoneMapper.class);

    Phone toPhone(PhoneDTO phoneDTO);

    PhoneDTO toPhoneDTO(Phone phone);

    List<PhoneDTO> toPhoneDTOs(List<Phone> phone);
    List<Phone> toPhoneList(List<PhoneDTO> phoneDTOList);
    Set<EmailDTO> phoneSetToPhoneDTOSet(Set<Phone> phones);
    Set<Phone> phoneDTOSetToPhoneSet(Set<PhoneDTO> phoneDTOS);

    default String mapPhoneTypeToLabel(PhoneType phoneType) {
        if(phoneType == null) {
            return null;
        }
        return phoneType.getLabel();
    }
}
