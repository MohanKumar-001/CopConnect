package com.copconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Challan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Optional user link if registered
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String vehicleNumber;
    private String reason;
    private String amount;
    private LocalDate date;

    // Status: Unpaid, Paid
    private String status;

    // If paid
    private String paymentId;
    private LocalDate paymentDate;
}
