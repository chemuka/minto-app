package com.pjdereva.minto.membership.config;

import com.pjdereva.minto.membership.dto.UserDto;
import com.pjdereva.minto.membership.model.Role;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.payload.response.AuthenticationResponse;
import com.pjdereva.minto.membership.service.JwtService;
import com.pjdereva.minto.membership.service.TokenService;
import com.pjdereva.minto.membership.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserService userService;
    private final TokenService tokenService;
    private final JwtService jwtService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {

        String targetUrl = frontendUrl + "/oauth2/redirect";
        AuthenticationResponse authResponse = null;
        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        String provider = oAuth2Token.getAuthorizedClientRegistrationId();
        //OAuth2User oAuth2User = oAuth2Token.getPrincipal();
        DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = principal.getAttributes();
        final String email = attributes.getOrDefault("email", "").toString();
        String names = attributes.getOrDefault("name", "").toString();
        final String picture;
        final String firstName;
        final String lastName;

        if("github".equals(provider)) {
            picture = attributes.getOrDefault("avatar_url", "").toString();
            String fName = "";
            String lName = "";
            int idx = names.lastIndexOf(" ");
            if(idx >= 0) {
                fName = names.substring(0, idx);
                lName = names.substring(idx + 1);
            } else {
                fName = names;
                idx = names.length();
            }
            firstName = fName;
            lastName = lName;

            userService.findUserByEmail(email)
                    .ifPresentOrElse(user -> {
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.getRole())),
                                attributes, "id");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(user.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    }, () -> {
                        var userDto = new UserDto(
                                firstName,
                                lastName,
                                email,
                                Role.USER.name(),
                                provider.toUpperCase(),
                                picture,
                                LocalDateTime.now().toString(),
                                LocalDateTime.now().toString());
                        userService.save(userDto);
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                attributes, "id");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        } else if("google".equals(provider)) {
            firstName = attributes.getOrDefault("given_name", "").toString();
            lastName = attributes.getOrDefault("family_name", "").toString();
            picture = attributes.getOrDefault("picture", "").toString();

            userService.findUserByEmail(email)
                    .ifPresentOrElse(user -> {
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.getRole())),
                                attributes, "name");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(user.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    }, () -> {
                        var userDto = new UserDto(
                                firstName,
                                lastName,
                                email,
                                Role.USER.name(),
                                provider.toUpperCase(),
                                picture,
                                LocalDateTime.now().toString(),
                                LocalDateTime.now().toString());
                        userService.save(userDto);
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                attributes, "name");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        } else if("facebook".equals(provider)) {
//            firstName = attributes.getOrDefault("given_name", "").toString();
//            lastName = attributes.getOrDefault("family_name", "").toString();
            picture = attributes.getOrDefault("picture", "").toString();
            String fName = "";
            String lName = "";
            int idx = names.lastIndexOf(" ");
            if(idx >= 0) {
                fName = names.substring(0, idx);
                lName = names.substring(idx + 1);
            } else {
                fName = names;
                idx = names.length();
            }
            firstName = fName;
            lastName = lName;

            userService.findUserByEmail(email)
                    .ifPresentOrElse(user -> {
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.getRole())),
                                attributes, "name");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(user.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    }, () -> {
                        var userDto = new UserDto(
                                firstName,
                                lastName,
                                email,
                                Role.USER.name(),
                                provider.toUpperCase(),
                                picture,
                                LocalDateTime.now().toString(),
                                LocalDateTime.now().toString());
                        userService.save(userDto);
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                attributes, "name");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(userDto.getRole())),
                                provider);
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        }

        // Create JWT - TODO: Consider a CustomOAuth2UserService
        Optional<User> optUser = userService.findByEmail(email);
        if(optUser.isPresent()) {
            User savedUser = optUser.get();
            var jwtToken = jwtService.generateToken(savedUser);
            var refreshToken = jwtService.generateRefreshToken(savedUser);
            tokenService.revokeAllUserTokens(savedUser);
            tokenService.saveUserToken(savedUser, jwtToken);
            authResponse = AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
            try {
                response.getWriter().write(authResponse.toString());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        assert authResponse != null;
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl).queryParam("accessToken", authResponse.getAccessToken()).build().toUriString();
        this.setAlwaysUseDefaultTargetUrl(true);
//        this.setDefaultTargetUrl(frontendUrl);
        this.setDefaultTargetUrl(targetUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
