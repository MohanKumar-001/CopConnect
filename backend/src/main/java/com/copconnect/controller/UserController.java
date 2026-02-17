package com.copconnect.controller;

import com.copconnect.entity.Challan;
import com.copconnect.entity.Complaint;
import com.copconnect.entity.RewardLog;
import com.copconnect.entity.SOSAlert;
import com.copconnect.entity.Sighting;
import com.copconnect.entity.User;
import com.copconnect.entity.Wanted;
import com.copconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private WantedRepository wantedRepository;

    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private SOSAlertRepository sosAlertRepository;
    @Autowired
    private SightingRepository sightingRepository;
    @Autowired
    private RewardLogRepository rewardLogRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChallanRepository challanRepository;

    private User getUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping("/complaints")
    public List<Complaint> getComplaints() {
        return complaintRepository.findByUserId(getUser().getId());
    }

    @PostMapping("/complaint")
    public ResponseEntity<?> fileComplaint(@RequestBody Complaint complaint) {
        User user = getUser();
        complaint.setUser(user);
        complaint.setUserName(user.getName());
        complaint.setStatus("PENDING");
        complaint.setDate(java.time.LocalDate.now());
        complaintRepository.save(complaint);
        return ResponseEntity.ok(complaint);
    }

    @PostMapping("/sos")
    public ResponseEntity<?> triggerSOS(@RequestBody SOSAlert alert) {
        alert.setUser(getUser());
        alert.setUserName(getUser().getName());
        alert.setTimestamp(LocalDateTime.now());
        alert.setStatus("ACTIVE");
        sosAlertRepository.save(alert);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/sos")
    public List<SOSAlert> getMySOS() {
        return sosAlertRepository.findByUserId(getUser().getId());
    }

    @GetMapping("/challans")
    public List<Challan> getMyChallans() {
        return challanRepository.findByUserId(getUser().getId());
    }

    @GetMapping("/challans/search")
    public List<Challan> searchChallans(@RequestParam("vehicleNumber") String vehicleNumber) {
        return challanRepository.findByVehicleNumber(vehicleNumber);
    }

    @PostMapping("/challan/{id}/pay")
    public ResponseEntity<?> payChallan(@PathVariable("id") Long id) {

        Challan challan = challanRepository.findById(id).orElseThrow();
        // optionally check if belongs to user
        challan.setStatus("Paid");
        challan.setPaymentDate(java.time.LocalDate.now());
        challan.setPaymentId("PAY-" + System.currentTimeMillis());
        challanRepository.save(challan);
        return ResponseEntity.ok(challan);
    }

    @PostMapping("/suspect-seen")
    public ResponseEntity<?> reportSighting(@RequestBody Sighting sighting) {
        sighting.setUser(getUser());
        sighting.setUserName(getUser().getName());
        sighting.setTimestamp(LocalDateTime.now());
        sighting.setStatus("PENDING");
        sightingRepository.save(sighting);
        return ResponseEntity.ok(sighting);
    }

    @GetMapping("/rewards")
    public List<RewardLog> getRewards() {
        return rewardLogRepository.findByRecipientId(getUser().getId());
    }

    @GetMapping("/wanted")
    public List<Wanted> getWanted() {
        return wantedRepository.findByStatus("ACTIVE");
    }

    @PostMapping("/reward/{id}/acknowledge")
    public ResponseEntity<?> acknowledgeReward(@PathVariable("id") Long id) {

        RewardLog log = rewardLogRepository.findById(id).orElseThrow();
        log.setNotified(true);
        rewardLogRepository.save(log);
        return ResponseEntity.ok("Acknowledged");
    }
}
