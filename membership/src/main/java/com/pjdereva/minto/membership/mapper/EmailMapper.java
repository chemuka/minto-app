package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.EmailDTO;
import com.pjdereva.minto.membership.model.Email;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmailMapper {

    EmailMapper INSTANCE = Mappers.getMapper(EmailMapper.class);

    Email toEmail(EmailDTO emailDTO);

    EmailDTO toEmailDTO(Email email);

    List<EmailDTO> toEmailDTOs(List<Email> emails);
}
