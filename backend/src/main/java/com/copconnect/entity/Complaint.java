package com.copconnect.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String title;
    private String description;
    private String userName;

    // Status: PENDING, INVESTIGATING, RESOLVED

    private String status;

    private String note;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
