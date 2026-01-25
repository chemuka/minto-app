package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.AddUserDTO;
import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.dto.UserDto;
import com.pjdereva.minto.membership.dto.UserInfoDTO;
import com.pjdereva.minto.membership.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    //UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    // For UserDto
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(UserDto userDto);

    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    UserDto toUserDto(User user);

    List<UserDto> toUserDtos(List<User> users);

    // For GetUserDTO
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(GetUserDTO getUserDTO);

    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    GetUserDTO toGetUserDTO(User user);

    List<GetUserDTO> toGetUserDTOs(List<User> users);

    // For AddUserDTO
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(AddUserDTO addUserDTO);

    AddUserDTO toAddUserDTO(User user);

    List<AddUserDTO> toAddUserDTOs(List<User> users);

    // For UserInfoDTO
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(UserInfoDTO userInfoDTO);

    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "lastLogin", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "accountLockedUntil", dateFormat = "yyyy-MM-dd HH:mm:ss")
    UserInfoDTO toUserInfoDTO(User user);

    List<UserInfoDTO> toUserInfoDTOs(List<User> users);
}
