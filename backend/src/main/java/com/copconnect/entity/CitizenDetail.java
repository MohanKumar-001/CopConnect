package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CitizenDetail {
    @Id
    private Long userId; // Matches User.id

    private String name;
    private String phoneNumber;
    private String aadhaar;
    private String vehicleNumber;
}
