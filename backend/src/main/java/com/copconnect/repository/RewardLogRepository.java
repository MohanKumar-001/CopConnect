package com.copconnect.repository;

import com.copconnect.entity.RewardLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardLogRepository extends JpaRepository<RewardLog, Long> {
    List<RewardLog> findByRecipientIdAndIsNotifiedFalse(Long recipientID);
    List<RewardLog> findByRecipientId(Long recipientId);

    boolean existsByIdAndRecipientId(Long id, Long recipientId);
}
