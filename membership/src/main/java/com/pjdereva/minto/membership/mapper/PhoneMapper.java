package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.PhoneDTO;
import com.pjdereva.minto.membership.model.Phone;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PhoneMapper {

    PhoneMapper INSTANCE = Mappers.getMapper(PhoneMapper.class);

    Phone toPhone(PhoneDTO phoneDTO);

    PhoneDTO toPhoneDTO(Phone phone);

    List<PhoneDTO> toPhoneDTOs(Phone phone);
}
