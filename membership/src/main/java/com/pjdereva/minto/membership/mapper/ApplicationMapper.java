package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.model.transaction.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {PersonMapper.class, UserMapper.class, ParentMapper.class,
ChildMapper.class, SpouseMapper.class, SiblingMapper.class, RefereeMapper.class, RelativeMapper.class, BeneficiaryMapper.class})
public interface ApplicationMapper {

    //ApplicationMapper INSTANCE = Mappers.getMapper(ApplicationMapper.class);

    @Mapping(target = "member", ignore = true)
    @Mapping(target = "appCreatedAt", ignore = true)
    @Mapping(target = "appUpdatedAt", ignore = true)
    @Mapping(target = "submittedDate", ignore = true)
    @Mapping(target = "approvedDate", ignore = true)
    @Mapping(target = "rejectedDate", ignore = true)
    Application toApplication(ApplicationDTO applicationDTO);

    @Mapping(target = "submittedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "approvedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "rejectedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "appCreatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "appUpdatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    ApplicationDTO toApplicationDTO(Application application);

    List<ApplicationDTO> toApplicationDTOs(List<Application> applications);
    Set<ApplicationDTO> applicationSetToApplicationDTOSet(Set<Application> applicationSet);
    Set<Application> applicationDTOSetToApplicationSet(Set<ApplicationDTO> applicationDTOSet);
}
