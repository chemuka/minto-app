package com.pjdereva.minto.membership.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pjdereva.minto.membership.dto.*;
import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.exception.UserIdNotFoundException;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import com.pjdereva.minto.membership.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
    private final UserMapper userMapper;

    @Value("${application.upload.dir}")
    private String uploadDir;

    public UserDto getUserByEmail(String email) {
        var existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email));
        return userMapper.toUserDto(existingUser);
    }

    public Optional<UserDto> findUserByEmail(String email) {
        return Optional.ofNullable(userMapper.toUserDto(userRepository.findByEmail(email)
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
        return userMapper.toUserDto(existingUser);
    }

    public UserInfoDTO getUserInfoById(Long id) {
        var existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserIdNotFoundException(id));
        return userMapper.toUserInfoDTO(existingUser);
    }

    public List<GetUserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toGetUserDTOs(users);
    }

    public List<UserInfoDTO> getAllUsersInfo() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserInfoDTOs(users);
    }

    public UserDto updateUser(UserUpdateDto userUpdateDto, MultipartFile imageFile) throws IOException {
        var existingUser = userRepository.findByEmail(userUpdateDto.email())
                .orElseThrow(() -> new UserEmailNotFoundException(userUpdateDto.email()));

        String pictureUrl = getUploadedFileName(imageFile);

        existingUser.setFirstName(userUpdateDto.firstName());
        existingUser.setLastName(userUpdateDto.lastName());
        existingUser.setPassword(passwordEncoder.encode(userUpdateDto.password()));
        existingUser.setRole(Role.valueOf(userUpdateDto.role()));
        existingUser.setPicture(pictureUrl);
        existingUser.setUpdatedAt(LocalDateTime.now());
        var savedUser = userRepository.save(existingUser);
        return userMapper.toUserDto(savedUser);
    }

    public UserDto patchUser(Map<String, Object> updates, MultipartFile imageFile) throws IOException {
        String email = (String) updates.get("email");
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
            if (!(imageFile.isEmpty())) {
                String pictureUrl = getUploadedFileName(imageFile);
                user.setPicture(pictureUrl);
            }

            if (updates.containsKey("person")) {
                ObjectMapper mapper = new ObjectMapper();
                Person person = mapper.convertValue(updates.get("person"), Person.class);
                user.setPerson(person);
            }
            user.setUpdatedAt(LocalDateTime.now());
            return userMapper.toUserDto(userRepository.save(user));
        }
        return null;
    }

    public void save(UserDto userDto) {
        userRepository.save(userMapper.toUser(userDto));
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
    public UserDto createGuestUser(AddUserDTO addUserDTO, MultipartFile file) throws IOException {
        log.info("Creating new GUEST user: {}", addUserDTO.email());

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
                .notes("Created by Staff/Admin.")
                .build();

        Email email = Email.builder()
                .emailType(EmailType.PERSONAL)
                .address(addUserDTO.email())
                .build();

        contact.addEmail(email);
        person.setContact(contact);

        // Store profile picture and get filename
        String pictureUrl = getUploadedFileName(file);


        // Create User account
        User newUser = User.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .email(addUserDTO.email())
                .password(passwordEncoder.encode(addUserDTO.password()))
                .role(Role.USER)
                .source(RegistrationSource.DASHBOARD)
                .picture(pictureUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .build();
        var savedUser = userRepository.save(newUser);

        log.info("User registered successfully: {} with GUEST user role", savedUser.getEmail());

        return userMapper.toUserDto(savedUser);
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
    public UserDto createStaffUser(AddUserDTO addUserDTO, MultipartFile file) throws IOException {
        log.info("Creating new STAFF user: {}", addUserDTO.email());

        // Validate
        if(userRepository.existsByEmail(addUserDTO.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create basic person
        Person person = Person.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .lifeStatus(LifeStatus.LIVING)
                .build();

        // Create Contact with email
        Contact contact = Contact.builder()
                .notes("Created by Staff/Admin.")
                .build();

        Email primaryEmail = Email.builder()
                .emailType(EmailType.PERSONAL)
                .address(addUserDTO.email())
                .build();

        contact.addEmail(primaryEmail);
        person.setContact(contact);

        // Store profile picture and get filename
        String pictureUrl = getUploadedFileName(file);

        User user = User.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .email(addUserDTO.email())
                .password(passwordEncoder.encode(addUserDTO.password()))
                .source(RegistrationSource.DASHBOARD)
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .picture(pictureUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Assign role STAFF
        user.setRole(Role.STAFF);

        user = userRepository.save(user);

        log.info("Staff user created: {} with STAFF user role", addUserDTO.email());

        return userMapper.toUserDto(user);
    }

    /**
     * Admin creates Admin user
     */
    @Transactional
    public UserDto createAdminUser(AddUserDTO addUserDTO, MultipartFile file) throws IOException {
        log.info("Creating new ADMIN user: {}", addUserDTO.email());

        if (userRepository.existsByEmail(addUserDTO.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Person person = Person.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .lifeStatus(LifeStatus.LIVING)
                .build();

        // Create Contact with email
        Contact contact = Contact.builder()
                .notes("Created by Staff/Admin.")
                .build();

        Email primaryEmail = Email.builder()
                .emailType(EmailType.PERSONAL)
                .address(addUserDTO.email())
                .build();

        contact.addEmail(primaryEmail);
        person.setContact(contact);

        // Store profile picture and get filename
        String pictureUrl = getUploadedFileName(file);

        User user = User.builder()
                .firstName(addUserDTO.firstName())
                .lastName(addUserDTO.lastName())
                .email(addUserDTO.email())
                .password(passwordEncoder.encode(addUserDTO.password()))
                .source(RegistrationSource.DASHBOARD)
                .accountStatus(AccountStatus.ACTIVE)
                .person(person)
                .picture(pictureUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Assign role ADMIN
        user.setRole(Role.ADMIN);

        user = userRepository.save(user);

        log.info("Admin user created: {} with ADMIN user role", addUserDTO.email());

        return userMapper.toUserDto(user);
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

    /**
     * Store image file and return the new filename
     * @param file Image file
     * @return the new filename/file path
     * @throws IOException if file path is invalid, image file is corrupted or not a valid image file.
     */
    private String getUploadedFileName(MultipartFile file) throws IOException {
        String filename = "";
        String pictureUrl = "";
        if (!(file.isEmpty())) {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            long maxSize = 5 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                throw new RuntimeException("File size must be less than 5MB");
            }

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            filename = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            pictureUrl = "/api/v1/uploads/profile-pictures/" + filename;
        }

        return pictureUrl;
    }

}
