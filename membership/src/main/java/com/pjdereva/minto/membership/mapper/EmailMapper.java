package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.EmailDTO;
import com.pjdereva.minto.membership.model.Email;
import com.pjdereva.minto.membership.model.EmailType;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface EmailMapper {

    Email toEmail(EmailDTO emailDTO);

    EmailDTO toEmailDTO(Email email);

    List<EmailDTO> toEmailDTOs(List<Email> emails);
    List<Email> toEmailList(List<EmailDTO> emailDTOList);
    Set<EmailDTO> emailSetToEmailDTOSet(Set<Email> emails);
    Set<Email> emailDTOSetToEmailSet(Set<EmailDTO> emailDTOS);

    default String mapEmailTypeToLabel(EmailType emailType) {
        if(emailType == null) {
            return null;
        }
        return emailType.getLabel();
    }
}
