package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.EnumData;
import com.pjdereva.minto.membership.model.Role;
import com.pjdereva.minto.membership.payload.request.AuthenticationRequest;
import com.pjdereva.minto.membership.payload.request.ChangePasswordRequest;
import com.pjdereva.minto.membership.payload.response.AuthenticationResponse;
import com.pjdereva.minto.membership.payload.request.RegisterRequest;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.service.AuthenticationService;
import com.pjdereva.minto.membership.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
public class AuthenticationController {

    private final AuthenticationService service;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        tokenService.refreshToken(request, response);
    }

    @PutMapping("/update-user")
    public ResponseEntity<AuthenticationResponse> updateUser(
            @RequestBody UserUpdateDto userUpdateDto,
            Principal principal
    ) {
        return ResponseEntity.ok(service.updateUser(userUpdateDto, principal));
    }

    @PatchMapping("/chgpwd")
    public ResponseEntity<AuthenticationResponse> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal principal
    ) {
        return ResponseEntity.ok(service.changePassword(request, principal));
    }

    @PostMapping("/logout/id")
    public ResponseEntity<?> logoutUserById(@RequestBody Map<String, Long> userId) {
        int resp = tokenService.deleteByUserId(userId.get("id"));
        return ResponseEntity.ok().body("User logged out successfully! Response = " + resp);
    }

    @PostMapping("/logout/email")
    public ResponseEntity<?> logoutUserByEmail(@RequestBody Map<String, String> userEmail) {
        int resp = tokenService.deleteByUserEmail(userEmail.get("email"));
        return ResponseEntity.ok().body("{\"message\": \"User logged out successfully!\"}");
    }

    @GetMapping("/roles")
    public ResponseEntity<List<EnumData>> getAllRoles() {
        return ResponseEntity.ok(
                Arrays.stream(Role.values())
                        .map(role -> new EnumData(role.name(), role.getLabel()))
                        .collect(Collectors.toList()));
    }

    /*
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok(List.of(Role.values()));
    }
     */

}
