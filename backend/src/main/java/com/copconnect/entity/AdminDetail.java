package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AdminDetail {
    @Id
    private Long userId; // Matches User.id

    private String name;
    private String department;
}
