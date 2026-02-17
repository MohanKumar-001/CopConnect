package com.copconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class SOSAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String userName; // For quick access
    private LocalDateTime timestamp;

    // Status: ACTIVE, RESOLVED, FALSE_ALARM
    private String status;

    private Double lat;
    private Double lng;

    private Long assignedOfficerId;
    private String assignedOfficerName;
}
