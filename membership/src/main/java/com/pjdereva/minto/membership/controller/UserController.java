package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.AddUserDTO;
import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserDto;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
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

    @PostMapping("/secure")
    public ResponseEntity<Optional<UserDto>> createUser(@RequestBody AddUserDTO addUserDTO) {
        var userDto = userService.createUser(addUserDTO);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/secure")
    public ResponseEntity<UserDto> updateUserByEmail(
            @RequestBody UserUpdateDto userUpdateDto,
            Principal principal) {
        var userDto = userService.updateUserByEmail(userUpdateDto);
        return ResponseEntity.ok(userDto);
    }

    @PatchMapping("/secure/{email}")
    public ResponseEntity<?> updateUser(@PathVariable String email, @RequestBody Map<String, Object> updates) {
        UserDto updatedUser = userService.patchUserByEmail(email, updates);
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest()
                    .body("Error: Something went wrong while updating user with email address: " + email);
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
}
