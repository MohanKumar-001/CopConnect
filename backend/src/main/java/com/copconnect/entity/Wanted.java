package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Wanted {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String reward;
    private String image; // URL
    private String status; // ACTIVE, CAUGHT
}
