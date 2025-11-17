package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.exception.ApplicationIdNotFoundException;
import com.pjdereva.minto.membership.exception.MemberIdNotFoundException;
import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.exception.UserIdNotFoundException;
import com.pjdereva.minto.membership.mapper.MemberMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.repository.ApplicationRepository;
import com.pjdereva.minto.membership.repository.MemberRepository;
import com.pjdereva.minto.membership.repository.UserRepository;
import com.pjdereva.minto.membership.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public Optional<Member> createMember(MemberDTO memberDTO) {
        var application = applicationRepository.findById(memberDTO.applicationId())
                .orElseThrow(() -> new ApplicationIdNotFoundException(memberDTO.applicationId()));

        if(!memberRepository.existsByUserIdOrApplicationId(memberDTO.userId(), memberDTO.applicationId())){
            Member newMember = Member.builder()
                    .userId(memberDTO.userId())
                    .memberCreatedAt(LocalDateTime.now())
                    .memberUpdatedAt(LocalDateTime.now())
                    .application(application)
                    .build();
            var savedMember = memberRepository.save(newMember);
            return Optional.of(savedMember);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public MemberDTO saveMember(MemberDTO memberDTO) {
        var member = memberRepository.save(MemberMapper.INSTANCE.toMember(memberDTO));
        return MemberMapper.INSTANCE.toMemberDTO(member);
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberIdNotFoundException(id));
    }

    @Override
    public Member getMemberByUserId(Long userId) {
        return memberRepository.findByUserId(userId)
                .orElseThrow(() -> new UserIdNotFoundException(userId));
    }

    @Override
    public Member getMemberByUserEmail(String userEmail) {
        Member member = null;
        Optional<User> user = userRepository.findByEmail(userEmail);
        if(user.isPresent()) {
             User existingUser = user.get();
             member = memberRepository.findByUserId(existingUser.getId())
                     .orElseThrow(() -> new UserIdNotFoundException(existingUser.getId()));
         }
        return member;
    }

    @Override
    public boolean existById(Long id) {
        return memberRepository.existsById(id);
    }

    @Override
    public Member updateMember(Member member) {
        member.setMemberUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }

    @Override
    public boolean deleteMemberById(Long id) {
        try {
            memberRepository.deleteById(id);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
