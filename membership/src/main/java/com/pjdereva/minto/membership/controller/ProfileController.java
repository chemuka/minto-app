package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<GetUserDTO> getProfile(Principal currentUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
        log.info("Get profile info for: {} {}", user.getFirstName(),user.getLastName());
        return ResponseEntity.ok(profileService.getProfile(user.getEmail()));
    }

    @PutMapping
    public ResponseEntity<GetUserDTO> updateProfile(
            @RequestBody UserUpdateDto request,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
        log.info("Updating profile info for: {} {}", user.getFirstName(),user.getLastName());
        return ResponseEntity.ok(profileService.updateProfile(user.getEmail(), request));
    }

    @PostMapping("/picture")
    public ResponseEntity<GetUserDTO> uploadProfilePicture(
            @RequestParam("file")MultipartFile file,
            Principal currentUser) throws IOException {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
        log.info("Uploading profile picture for: {} {}", user.getFirstName(),user.getLastName());
        return ResponseEntity.ok(profileService.uploadProfilePicture(user.getEmail(), file));
    }
}
