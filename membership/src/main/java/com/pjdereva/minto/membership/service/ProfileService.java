package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProfileService {
    GetUserDTO getProfile(String email);
    GetUserDTO updateProfile(String email, UserUpdateDto request);
    GetUserDTO uploadProfilePicture(String email, MultipartFile file) throws IOException;
}
