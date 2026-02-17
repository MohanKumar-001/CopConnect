package com.copconnect.repository;

import com.copconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByVehicleNumber(String vehicleNumber);

    Boolean existsByEmail(String email);
}
