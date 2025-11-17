package com.pjdereva.minto.membership.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.Contact;
import com.pjdereva.minto.membership.model.transaction.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    @Mapping(target = "id", ignore = true)
    Member toMember(MemberDTO memberDTO);

    @Mapping(target = "memberCreatedAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    @Mapping(target = "memberUpdatedAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss")
    MemberDTO toMemberDTO(Member member);

    List<MemberDTO> toMemberDTOs(List<Member> members);

}
