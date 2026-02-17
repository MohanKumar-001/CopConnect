package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sighting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String wantedId; // Sighting of...
    private String wantedName;
    private String reward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String userName;

    private LocalDateTime timestamp;
    private String location;
    private String description;

    // Status: PENDING, VERIFIED, RESOLVED, FALSE_ALARM
    private String status;

    private String resolvedBy;
    private LocalDateTime resolvedAt;
}
