package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.service.impl.MemberServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberServiceImpl memberService;

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

}
