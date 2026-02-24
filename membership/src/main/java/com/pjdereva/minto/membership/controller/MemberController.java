package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.mapper.MemberMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.model.transaction.MembershipStatus;
import com.pjdereva.minto.membership.payload.response.MemberResponse;
import com.pjdereva.minto.membership.service.impl.MemberServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
@RequestMapping("/api/v1/members")
public class MemberController {

    private static final Logger log = LoggerFactory.getLogger(MemberController.class);
    private final MemberServiceImpl memberService;
    private final MemberMapper memberMapper;

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        var member = memberService.getMemberById(id);
        return ResponseEntity.ok(member);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Member> getMemberByUserEmail(@PathVariable String email) {
        var member = memberService.getMemberByUserEmail(email);
        return ResponseEntity.ok(member);
    }

    @PostMapping
    public ResponseEntity<?> createMember(@RequestBody MemberDTO memberDTO) {
        Optional<Member> member = Optional.empty();
        try {
            member = memberService.createMember(memberDTO);
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok(member);
    }

    @PutMapping
    public ResponseEntity<?> updateMember(@RequestBody Member member) {
        var updatedMember = memberService.updateMember(member);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMemberById(@PathVariable Long id) {
        if(!memberService.existById(id)) {
            return ResponseEntity.badRequest()
                    .body("Error: Member with id: " + id + " does not exist.");
        }
        boolean response = false;
        try {
            response = memberService.deleteMemberById(id);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        if(response)
            return ResponseEntity.ok("Member with id " + id + " has been deleted successfully.");
        else
            return ResponseEntity.unprocessableEntity().body("Error: Something went wrong in the database!");
    }

    /**
     * Get all membership records
     * GET /api/vi/members/dto
     */
    @GetMapping("/dto")
    public ResponseEntity<?> getAllMembersDTO() {
        try {
            List<Member> members = memberService.getAllMembers();
            return ResponseEntity.ok(memberMapper.toMemberDTOs(members));
        } catch (Exception e) {
            log.error("Error getting all membership records.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Get membership record by id
     * GET /api/vi/members/dto/id/{id}
     */
    @GetMapping("/dto/id/{id}")
    public ResponseEntity<?> getMemberDTOById(@PathVariable Long id) {
        try {
            var member = memberService.getMemberById(id);
            return ResponseEntity.ok(memberMapper.toMemberDTO(member));
        } catch (Exception e) {
            log.error("Error getting membership record with id: {}. ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Get member by email
     * GET /api/vi/members/dto/email/{email}
     */
    @GetMapping("/dto/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        try {
            var memberDTO = memberService.findByEmail(email);
            return ResponseEntity.ok(memberDTO);
        } catch (Exception e) {
            log.error("Could not find member with email: {}. {} ", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MemberResponse.builder()
                            .success(false)
                            .message("Failed to find member: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Get all membership records by membership status
     * GET /api/vi/members/status/{membershipStatus}
     */
    @GetMapping("/status/{membershipStatus}")
    public ResponseEntity<?> getAllByMembershipStatus(
            @PathVariable String membershipStatus) {
        try {
            List<Member> members = memberService.findAllByStatus(MembershipStatus.fromLabel(membershipStatus));
            return ResponseEntity.ok(memberMapper.toMemberDTOs(members));
        } catch (Exception e) {
            log.error("Error getting all membership records with membership status: {}", membershipStatus);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Get all membership records by membership statuses
     * GET /api/vi/members/status/in/{membershipStatuses}
     */
    @GetMapping("/status/in/{membershipStatuses}")
    public ResponseEntity<?> getAllByMembershipStatusIn(
            @PathVariable List<String> membershipStatuses) {
        try {
            List<MembershipStatus> statuses = membershipStatuses.stream()
                    .map(MembershipStatus::fromLabel)
                    .toList();
            List<Member> members = memberService.findAllByStatusIn(statuses);
            return ResponseEntity.ok(memberMapper.toMemberDTOs(members));
        } catch (Exception e) {
            log.error("Error getting all membership records with membership status in the status list.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Get all approved applications that are yet to be activated for membership.
     * Also include all rejected and withdrawn applications to the list.
     * GET /api/vi/members/approved/inactive
     */
    @GetMapping("/approved/inactive")
    public ResponseEntity<?> getAllApprovedInactiveApplications() {
        try {
            List<ApplicationDTO> applications = memberService.findAllInactiveApprovedApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            log.error("Error getting all approved but inactive applications.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Save or update member
     * POST /api/v1/members/draft
     */
    @PostMapping("/draft")
    public ResponseEntity<MemberResponse> saveDraft(
            @RequestBody MemberDTO draft,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Saving member by: {} {}", user.getFirstName(), user.getLastName());

        try {
            Member member = memberService.createMemberFromApplication(draft.getApplication().getId());

            MemberResponse response = MemberResponse.builder()
                    .success(true)
                    .message("Member saved successfully")
                    .membershipNumber(member.getMembershipNumber())
                    .memberId(member.getId())
                    .applicationId(member.getApplication().getId())
                    .userFullName(member.getApplication().getPerson().getFullName())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving member. {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MemberResponse.builder()
                            .success(false)
                            .message("Failed to save member: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Update member
     * PATCH /api/v1/members/draft
     */
    @PatchMapping("/draft")
    public ResponseEntity<MemberResponse> updateDraft(
            @RequestBody MemberDTO draft,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Updating member by: {} {}", user.getFirstName(), user.getLastName());

        try {
            MemberDTO memberDTO = memberService.saveMember(draft);

            String fullName = memberDTO.getApplication().getPerson().getFirstName() + " " +
                    memberDTO.getApplication().getPerson().getMiddleName() + " " +
                    memberDTO.getApplication().getPerson().getLastName();

            MemberResponse response = MemberResponse.builder()
                    .success(true)
                    .message("Member " + memberDTO.getMembershipNumber() + " updated successfully")
                    .membershipNumber(memberDTO.getMembershipNumber())
                    .memberId(memberDTO.getId())
                    .applicationId(memberDTO.getApplication().getId())
                    .userFullName(fullName)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating member. {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MemberResponse.builder()
                            .success(false)
                            .message("Failed to update member: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Activate membership
     * POST /api/v1/members/draft/activate
     */
    @PostMapping("/activate")
    public ResponseEntity<?> activateMembership(@RequestBody MemberDTO memberDTO) {
        try {
            memberService.activateMember(memberDTO.getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Member " + memberDTO.getMembershipNumber() +
                " activated successfully.");
    }

    /**
     * Suspend membership
     * POST /api/v1/members/draft/suspend
     */
    @PostMapping("/suspend")
    public ResponseEntity<?> suspendMembership(
            @RequestBody MemberDTO memberDTO,
            Principal currentUser) {

        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                memberService.suspendMembership(memberDTO.getId(), memberDTO.getNotes());
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to suspend membership.");
            }
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }

        return ResponseEntity.ok("Membership: " + memberDTO.getMembershipNumber() +
                " suspended successfully. Reason: " + memberDTO.getNotes());
    }

    /**
     * Terminate membership
     * POST /api/v1/members/draft/terminate
     */
    @PostMapping("/terminate")
    public ResponseEntity<?> terminateMembership(
            @RequestBody MemberDTO memberDTO,
            Principal currentUser) {

        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                memberService.terminateMembership(memberDTO.getId(), memberDTO.getTerminationReason());
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to terminate membership.");
            }
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }

        return ResponseEntity.ok("Membership: " + memberDTO.getMembershipNumber() +
                " terminated successfully. Reason: " + memberDTO.getTerminationReason());
    }
}
