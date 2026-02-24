package com.pjdereva.minto.membership.dto;

import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.model.AccountStatus;
import com.pjdereva.minto.membership.model.RegistrationSource;
import com.pjdereva.minto.membership.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private RegistrationSource source;
    private String picture;
    private String createdAt;
    private String updatedAt;
    private PersonDTO person;
    private Set<ApplicationDTO> applications;
    private MemberDTO member;
    private AccountStatus accountStatus;
    private String lastLogin;
    private int failedLoginAttempts;
    private String accountLockedUntil;
}
