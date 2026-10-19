package com.copconnect.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private User user;

    private String vehicleNumber;
    private String reason;
    private String amount;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    // Status: Unpaid, Paid
    private String status;

    // If paid
    private String paymentId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate paymentDate;
}
