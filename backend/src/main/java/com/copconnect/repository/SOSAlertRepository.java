package com.copconnect.repository;

import com.copconnect.entity.SOSAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SOSAlertRepository extends JpaRepository<SOSAlert, Long> {
    List<SOSAlert> findByStatus(String status);

    List<SOSAlert> findByUserId(Long userId);

    List<SOSAlert> findByAssignedOfficerId(Long assignedOfficerId);
}
