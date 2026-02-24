package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.*;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<GetUserDTO>> getAllUsers() {
        List<GetUserDTO> userDtos = userService.getAllUsers();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        var userDto = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/{id}/id")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        var userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/info")
    public ResponseEntity<List<UserInfoDTO>> getAllUserInfo() {
        List<UserInfoDTO> userInfoDTOList = userService.getAllUsersInfo();
        return ResponseEntity.ok(userInfoDTOList);
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<UserInfoDTO> getUserInfoById(@PathVariable Long id) {
        var userInfoDTO = userService.getUserInfoById(id);
        return ResponseEntity.ok(userInfoDTO);
    }

    @GetMapping("/secure/{email}/image")
    public ResponseEntity<byte[]> getImageByEmail(@PathVariable String email) {
        try {
            var optionalUser = userService.findByEmail(email);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                return ResponseEntity.ok().contentType(MediaType.valueOf(user.getImageType())).body(user.getImageData());
            }
            return new ResponseEntity<>("".getBytes(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("".getBytes(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/secure")
    public ResponseEntity<?> createGuestUser(@RequestPart AddUserDTO addUserDTO,
                                             @RequestPart MultipartFile imageFile) {
        try {
            var userDto = userService.createGuestUser(addUserDTO, imageFile);
            return new ResponseEntity<>(userDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/secure")
    public ResponseEntity<?> updateUser(
            @RequestPart UserUpdateDto userUpdateDto,
            @RequestPart MultipartFile imageFile) {
        try {
            var userDto = userService.updateUser(userUpdateDto, imageFile);
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/secure")
    public ResponseEntity<?> patchUser(@RequestPart Map<String, Object> updates,
                                        @RequestPart MultipartFile imageFile) {
        try {
            UserDto updatedUser = userService.patchUser(updates, imageFile);
            if (updatedUser != null) {
                return new ResponseEntity<>(updatedUser, HttpStatus.OK);
            } else {
                return ResponseEntity.badRequest()
                        .body("Error: Something went wrong while updating user.");
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/secure/{email}")
    public ResponseEntity<?> deleteUserByEmail(@PathVariable String email) {
        var response = userService.deleteUserByEmail(email);
        if(response) {
            return ResponseEntity.ok("Successfully deleted user with email address: " + email);
        } else {
            return ResponseEntity.badRequest()
                    .body("Error: Something went wrong while deleting user with email address: " + email);
        }
    }

    @PostMapping("/secure/admin")
    public ResponseEntity<UserDto> createAdminUser(@RequestBody AddUserDTO addUserDTO,
                                                   @RequestParam("file") MultipartFile file) throws IOException {
        var userDto = userService.createAdminUser(addUserDTO, file);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/secure/staff")
    public ResponseEntity<UserDto> createStaffUser(@RequestBody AddUserDTO addUserDTO,
                                                   @RequestParam("file") MultipartFile file) throws IOException {
        var userDto = userService.createStaffUser(addUserDTO, file);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/secure/upgrade/user")
    public ResponseEntity<String> upgradeUserToMember(@RequestBody GetUserDTO getUserDTO) {
        userService.upgradeUserToMember(getUserDTO.getId());
        return ResponseEntity.ok("User with User Id: " + getUserDTO.getId() + ", upgraded to member.");
    }

    @PostMapping("/secure/downgrade/user")
    public ResponseEntity<String> downgradeMemberToGuestUser(@RequestBody GetUserDTO getUserDTO) {
        userService.downgradeMemberToGuest(getUserDTO.getId());
        return ResponseEntity.ok("Member with User Id: " + getUserDTO.getId() + ", downgraded to user.");
    }
}
