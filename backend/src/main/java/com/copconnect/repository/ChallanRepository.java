package com.copconnect.repository;

import com.copconnect.entity.Challan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChallanRepository extends JpaRepository<Challan, Long> {
    List<Challan> findByVehicleNumber(String vehicleNumber);

    List<Challan> findByUserId(Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    List<Challan> findByStatus(String status);
}
