package com.copconnect.repository;

import com.copconnect.entity.Wanted;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WantedRepository extends JpaRepository<Wanted, Long> {
    List<Wanted> findByStatus(String status);
}
