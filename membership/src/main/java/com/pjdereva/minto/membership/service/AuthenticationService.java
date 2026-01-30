package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import com.pjdereva.minto.membership.payload.request.AuthenticationRequest;
import com.pjdereva.minto.membership.payload.request.ChangePasswordRequest;
import com.pjdereva.minto.membership.payload.response.AuthenticationResponse;
import com.pjdereva.minto.membership.payload.request.RegisterRequest;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // Create Person with basic info
        Person person = Person.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .lifeStatus(LifeStatus.LIVING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Create Contact with email
        Contact contact = Contact.builder()
                .notes("Created by User.")
                .build();

        Email email = Email.builder()
                .emailType(EmailType.PERSONAL)
                .address(request.getEmail())
                .build();

        contact.addEmail(email);
        person.setContact(contact);

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .source(RegistrationSource.SIGNUP)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .person(person)
                .build();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        tokenService.saveUserToken(savedUser, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse updateUser(UserUpdateDto userUpdateDto, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        Person person = user.getPerson();
        person.setFirstName(userUpdateDto.firstName());
        person.setLastName(userUpdateDto.lastName());
        person.setUpdatedAt(LocalDateTime.now());

        user.setFirstName(userUpdateDto.firstName());
        user.setLastName(userUpdateDto.lastName());
        user.setPassword(passwordEncoder.encode(userUpdateDto.password()));
        user.setRole(Role.valueOf(userUpdateDto.role()));
        user.setPicture(userUpdateDto.picture());
        user.setUpdatedAt(LocalDateTime.now());
        user.setPerson(person);

        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        tokenService.revokeAllUserTokens(savedUser);
        tokenService.saveUserToken(savedUser, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserEmailNotFoundException(request.getEmail()));
        user.setLastLogin(LocalDateTime.now());
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        tokenService.revokeAllUserTokens(user);
        tokenService.saveUserToken(user, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

//    public void saveUserToken(User user, String jwtToken) {
//        var token = Token.builder()
//                .user(user)
//                .token(jwtToken)
//                .tokenType(TokenType.BEARER)
//                .expired(false)
//                .revoked(false)
//                .build();
//        tokenRepository.save(token);
//    }
//
//    public void revokeAllUserTokens(User user) {
//        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
//        if (validUserTokens.isEmpty())
//            return;
//        validUserTokens.forEach(token -> {
//            token.setExpired(true);
//            token.setRevoked(true);
//        });
//        tokenRepository.saveAll(validUserTokens);
//    }
//
//    public void refreshToken(
//            HttpServletRequest request,
//            HttpServletResponse response
//    ) throws IOException {
//        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//        final String refreshToken;
//        final String userEmail;
//
//        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
//            return;
//        }
//
//        refreshToken = authHeader.substring(7);
//        userEmail = jwtService.extractUsername(refreshToken);
//
//        if (userEmail != null) {
//            var user = this.userRepository.findByEmail(userEmail)
//                    .orElseThrow();
//            if (jwtService.isTokenValid(refreshToken, user)) {
//                var accessToken = jwtService.generateToken(user);
//                revokeAllUserTokens(user);
//                saveUserToken(user, accessToken);
//                var authResponse = AuthenticationResponse.builder()
//                        .accessToken(accessToken)
//                        .refreshToken(refreshToken)
//                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
//            }
//        }
//    }

    public AuthenticationResponse changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());

        // save the new password
        var updatedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(updatedUser);
        var refreshToken = jwtService.generateRefreshToken(updatedUser);
        
        tokenService.revokeAllUserTokens(updatedUser);
        tokenService.saveUserToken(updatedUser, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
