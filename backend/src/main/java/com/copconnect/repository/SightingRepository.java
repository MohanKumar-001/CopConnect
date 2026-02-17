package com.copconnect.repository;

import com.copconnect.entity.Sighting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SightingRepository extends JpaRepository<Sighting, Long> {
    List<Sighting> findByStatus(String status);

    List<Sighting> findByStatusNotIn(List<String> statuses);

    List<Sighting> findByStatusIn(List<String> statuses);
}
