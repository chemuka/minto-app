package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.transaction.Member;

import java.util.List;
import java.util.Optional;

public interface MemberService {

    Optional<Member> createMember(MemberDTO memberDTO);
    MemberDTO saveMember(MemberDTO memberDTO);
    List<Member> getAllMembers();
    Member getMemberById(Long id);
    Member getMemberByUserId(Long userId);
    Member getMemberByUserEmail(String email);
    boolean existById(Long id);
    Member updateMember(Member member);
    boolean deleteMemberById(Long id);

}
