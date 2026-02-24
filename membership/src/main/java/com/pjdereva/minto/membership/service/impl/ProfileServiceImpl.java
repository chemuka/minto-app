package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserUpdateDto;
import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.repository.UserRepository;
import com.pjdereva.minto.membership.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Value("${application.upload.dir}")
    private String uploadDir;

    @Override
    public GetUserDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email));
        return userMapper.toGetUserDTO(user);
    }

    @Override
    public GetUserDTO updateProfile(String email, UserUpdateDto request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email));
        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        userRepository.save(user);
        return userMapper.toGetUserDTO(user);
    }

    @Override
    public GetUserDTO uploadProfilePicture(String email, MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("File is empty");

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
        String filename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String pictureUrl = "/api/v1/uploads/profile-pictures/" + filename;

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserEmailNotFoundException(email));

        //Delete old picture if exists
        if (user.getPicture() != null) {
            String oldFilename = user.getPicture().substring(user.getPicture().lastIndexOf("/") + 1);

            Path oldFilePath = uploadPath.resolve(oldFilename);
            try { Files.deleteIfExists(oldFilePath); } catch (Exception ignored) {}
        }

        user.setPicture(pictureUrl);
        userRepository.save(user);
        return userMapper.toGetUserDTO(user);
    }
}
