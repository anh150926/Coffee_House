package com.coffee.management.service;

import com.coffee.management.dto.user.CreateUserRequest;
import com.coffee.management.dto.user.UpdateUserRequest;
import com.coffee.management.dto.user.UserResponse;
import com.coffee.management.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interface definition for User Service operations.
 */
public interface IUserService {

    Page<UserResponse> getAllUsers(UserPrincipal currentUser, Pageable pageable);

    UserResponse getUserById(Long id, UserPrincipal currentUser);

    UserResponse createUser(CreateUserRequest request, UserPrincipal currentUser);

    UserResponse updateUser(Long id, UpdateUserRequest request, UserPrincipal currentUser);

    void deleteUser(Long id, UserPrincipal currentUser);

    Page<UserResponse> getUsersByStore(Long storeId, Pageable pageable);

    long getStaffCountByStore(Long storeId);
}
