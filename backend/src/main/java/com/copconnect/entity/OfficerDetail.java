package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OfficerDetail {
    @Id
    private Long userId; // Matches User.id

    private String name;
    private String phoneNumber;
    private String badgeNumber;
    private String station;
}
