package com.coffee.management.repository;

import com.coffee.management.dto.user.UserSummary;
import com.coffee.management.entity.Role;
import com.coffee.management.entity.User;
import com.coffee.management.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByStoreId(Long storeId);

    org.springframework.data.domain.Page<User> findByStoreId(Long storeId, org.springframework.data.domain.Pageable pageable);

    List<User> findByStoreIdAndRole(Long storeId, Role role);

    List<User> findByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE u.store.id = :storeId AND u.status = com.coffee.management.entity.UserStatus.ACTIVE")
    List<User> findActiveStaffByStore(@Param("storeId") Long storeId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.store.id = :storeId AND u.role = com.coffee.management.entity.Role.STAFF")
    long countStaffByStore(@Param("storeId") Long storeId);

    // For broadcast notifications
    @Query("SELECT u FROM User u WHERE u.store.id = :storeId AND u.status = :status")
    List<User> findByStoreIdAndStatus(@Param("storeId") Long storeId, @Param("status") UserStatus status);

    @Query("SELECT u FROM User u WHERE u.status = :status AND u.role != :role")
    List<User> findByStatusAndRoleNot(@Param("status") UserStatus status, @Param("role") Role role);

    // For employee ranking
    @Query("SELECT u FROM User u WHERE u.role = com.coffee.management.entity.Role.STAFF AND u.status = com.coffee.management.entity.UserStatus.ACTIVE ORDER BY u.fullName")
    List<User> findAllActiveStaff();

    @Query("SELECT u FROM User u WHERE u.store.id = :storeId AND u.role = com.coffee.management.entity.Role.STAFF AND u.status = com.coffee.management.entity.UserStatus.ACTIVE")
    List<User> findActiveStaffByStoreId(@Param("storeId") Long storeId);

    // ────────────────────────────────────────────────
    // DTO Projection — chỉ select các cột cần thiết (tránh fetch avatarUrl LONGTEXT)
    // ────────────────────────────────────────────────
    @Query("SELECT u.id as id, u.username as username, u.fullName as fullName, "
        + "u.email as email, u.phone as phone, "
        + "u.role as role, u.status as status, "
        + "u.store.name as storeName, u.needPasswordChange as needPasswordChange "
        + "FROM User u LEFT JOIN u.store "
        + "WHERE u.store.id = :storeId AND u.deleted = false")
    List<UserSummary> findUserSummariesByStore(@Param("storeId") Long storeId);

    @Query("SELECT u.id as id, u.username as username, u.fullName as fullName, "
        + "u.email as email, u.phone as phone, "
        + "u.role as role, u.status as status, "
        + "u.store.name as storeName, u.needPasswordChange as needPasswordChange "
        + "FROM User u LEFT JOIN u.store "
        + "WHERE u.deleted = false")
    List<UserSummary> findAllUserSummaries();

    // ────────────────────────────────────────────────
    // JOIN FETCH — tránh N+1 khi cần object đầy đủ (dùng trong payroll, ranking)
    // ────────────────────────────────────────────────
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.store "
        + "WHERE u.store.id = :storeId AND u.status = com.coffee.management.entity.UserStatus.ACTIVE "
        + "AND u.deleted = false")
    List<User> findActiveStaffWithStoreByStoreId(@Param("storeId") Long storeId);
}
