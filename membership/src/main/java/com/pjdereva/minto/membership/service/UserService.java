package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.AddUserDTO;
import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserDto;
import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.exception.UserIdNotFoundException;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import com.pjdereva.minto.membership.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * NEW FLOW: User Registration First Approach
 * 1. User registers (Guest role)
 * 2. User submits application
 * 3. Application approved -> User upgraded to Member role
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUserByEmail(String email) {
        var existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email));
        return UserMapper.INSTANCE.toUserDto(existingUser);
    }

    public Optional<UserDto> findUserByEmail(String email) {
        return Optional.ofNullable(UserMapper.INSTANCE.toUserDto(userRepository.findByEmail(email)
                .orElse(null)));
//        return Optional.ofNullable(userMapper.toUserDto(userRepository.findByEmail(email)
//                .orElseThrow(() -> new UserEmailNotFoundException(email))));
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email)));
    }

    public UserDto getUserById(Long id) {
        var existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserIdNotFoundException(id));
        return UserMapper.INSTANCE.toUserDto(existingUser);
    }

    public List<GetUserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return UserMapper.INSTANCE.toGetUserDTOs(users);
    }

    public UserDto updateUserByEmail(UserUpdateDto userUpdateDto) {
        var existingUser = userRepository.findByEmail(userUpdateDto.email())
                .orElseThrow(() -> new UserEmailNotFoundException(userUpdateDto.email()));
        existingUser.setFirstName(userUpdateDto.firstName());
        existingUser.setLastName(userUpdateDto.lastName());
        existingUser.setPassword(passwordEncoder.encode(userUpdateDto.password()));
        existingUser.setRole(Role.valueOf(userUpdateDto.role()));
        existingUser.setPicture(userUpdateDto.picture());
        existingUser.setUpdatedAt(LocalDateTime.now());
        var savedUser = userRepository.save(existingUser);
        return UserMapper.INSTANCE.toUserDto(savedUser);
    }

    public UserDto patchUserByEmail(String email, Map<String, Object> updates) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Update user fields based on the provided updates
            if (updates.containsKey("firstName")) {
                user.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("password")) {
                user.setPassword(passwordEncoder.encode((String) updates.get("password")));
            }
            if (updates.containsKey("role")) {
                user.setRole(Role.valueOf((String) updates.get("role")));
            }
            if (updates.containsKey("picture")) {
                user.setPicture((String) updates.get("picture"));
            }
            user.setUpdatedAt(LocalDateTime.now());
            return UserMapper.INSTANCE.toUserDto(userRepository.save(user));
        }
        return null;
    }

    public void save(UserDto userDto) {
        userRepository.save(UserMapper.INSTANCE.toUser(userDto));
    }

    public boolean deleteUserByEmail(String email) {
        var user = userRepository.findByEmail(email);
        user.ifPresent(value -> userRepository.deleteById(value.getId()));
        return !userRepository.existsByEmail(email);
    }

    /**
     * STEP 1 & 2: Register new user account (starts as GUEST) and activate account
     */
    @Transactional
    public Optional<UserDto> createUser(AddUserDTO addUserDTO) {
        log.info("Registering new user: {}", addUserDTO.email());

        // Validate
        if(userRepository.existsByEmail(addUserDTO.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create Person with basic info
        Person person = Person.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .lifeStatus(LifeStatus.LIVING)
                .build();

        // Create Contact with email
        Contact contact = Contact.builder()
                .notes("Created during registration")
                .build();

        Email email = Email.builder()
                .type(EmailType.PERSONAL)
                .address(addUserDTO.email())
                .build();

        contact.addEmail(email);
        person.setContact(contact);

        // Create User account
        User newUser = User.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .email(addUserDTO.email())
                .password(passwordEncoder.encode(addUserDTO.password()))
                .role(Role.valueOf(addUserDTO.role()))
                .source(RegistrationSource.valueOf(addUserDTO.source()))
                .picture(addUserDTO.picture())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .build();
        var savedUser = userRepository.save(newUser);

        log.info("User registered successfully: {} with GUEST user role", savedUser.getEmail());

        return Optional.ofNullable(UserMapper.INSTANCE.toUserDto(savedUser));
    }

    /**
     * STEP 3: After application approval, upgrade User to Member role
     */
    @Transactional
    public void upgradeUserToMember(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove ROLE_GUEST
        user.upgradeToMember();

        userRepository.save(user);

        log.info("User {} upgraded to MEMBER user role", user.getEmail());
    }

    /**
     * Admin creates Staff user
     */
    @Transactional
    public User createStaffUser(String firstName, String lastName,
                               String email, String password) {
        log.info("Creating staff user: {}", email);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create basic person
        Person person = Person.builder()
                .firstName(firstName)
                .lastName(lastName)
                .lifeStatus(LifeStatus.LIVING)
                .build();

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .build();

        // Assign ROLE_STAFF
        user.setRole(Role.STAFF);

        user = userRepository.save(user);

        log.info("Staff user created: {} with STAFF user role", email);
        return user;
    }

    /**
     * Admin creates Admin user
     */
    @Transactional
    public User createAdminUser(String firstName, String lastName,
                                String email, String password) {
        log.info("Creating admin user: {}", email);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        Person person = Person.builder()
                .firstName(firstName)
                .lastName(lastName)
                .lifeStatus(LifeStatus.LIVING)
                .build();

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .build();

        // Assign ROLE_ADMIN
        user.setRole(Role.ADMIN);

        user = userRepository.save(user);

        log.info("Admin user created: {} with ADMIN user role", email);
        return user;
    }

    /**
     * Handle member termination - downgrade back to Guest
     */
    @Transactional
    public void downgradeMemberToGuest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.USER);

        userRepository.save(user);
        log.info("User {} downgraded to GUEST user role", user.getEmail());
    }
}
