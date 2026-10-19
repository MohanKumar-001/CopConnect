package com.copconnect.controller;

import com.copconnect.entity.*;
import com.copconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    @Autowired
    private SightingRepository sightingRepository;
    @Autowired
    private RewardLogRepository rewardLogRepository;
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private SOSAlertRepository sosAlertRepository;
    @Autowired
    private ChallanRepository challanRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WantedRepository wantedRepository;

    private User getOfficer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new NoSuchElementException("Officer not found"));
    }

    // --- Intelligence System ---
    @GetMapping("/active-intelligence")
    public List<Sighting> getActiveIntelligence() {
        return sightingRepository.findByStatusNotIn(List.of("RESOLVED", "FALSE_ALARM"));
    }

    @GetMapping("/intelligence-history")
    public List<Sighting> getIntelligenceHistory() {
        return sightingRepository.findByStatusIn(List.of("RESOLVED", "FALSE_ALARM"));
    }

    @PostMapping("/alert/{id}/false")
    public ResponseEntity<?> markFalseAlarm(@PathVariable("id") Long id) {

        Sighting sighting = sightingRepository.findById(id).orElseThrow();
        sighting.setStatus("FALSE_ALARM");
        sightingRepository.save(sighting);
        return ResponseEntity.ok(Map.of("message", "Marked as False Alarm", "status", "FALSE_ALARM"));
    }

    @PostMapping("/alert/{id}/caught")
    @jakarta.transaction.Transactional
    public ResponseEntity<?> markCaught(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {

        Sighting sighting = sightingRepository.findById(id).orElseThrow();
        sighting.setStatus("RESOLVED");
        sighting.setResolvedBy(body.getOrDefault("officerName", getOfficer().getName()));
        sighting.setResolvedAt(LocalDateTime.now());
        sightingRepository.save(sighting);

        // Update Wanted person status
        try {
            Long wantedId = Long.valueOf(sighting.getWantedId());
            Wanted wanted = wantedRepository.findById(wantedId).orElse(null);
            if (wanted != null) {
                wanted.setStatus("CAUGHT");
                wantedRepository.save(wanted);
            }
        } catch (Exception e) {
            // Log error but don't fail the whole transaction if wanted update fails
            System.err.println("Could not update wanted status: " + e.getMessage());
        }

        // Reward Logic
        RewardLog log = new RewardLog();
        log.setSighting(sighting);
        log.setRecipient(sighting.getUser());
        log.setAmount(sighting.getReward());
        log.setTimestamp(LocalDateTime.now());
        log.setNotified(false);
        rewardLogRepository.save(log);

        return ResponseEntity
                .ok(Map.of("message", "Suspect Caught & Reward Dispatched", "reward", sighting.getReward()));
    }

    // --- Complaints ---
    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping("/complaint/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {

        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        if (body.containsKey("status")) {
            complaint.setStatus(body.get("status"));
        }
        if (body.containsKey("note")) {
            complaint.setNote(body.get("note"));
        }
        complaintRepository.save(complaint);
        return ResponseEntity.ok(complaint);
    }

    // --- SOS Alerts ---
    @GetMapping("/sos-alerts")
    public List<SOSAlert> getMySOS() {
        Long officerId = getOfficer().getId();
        // Return alerts assigned to this officer OR active alerts that aren't assigned
        // yet
        return sosAlertRepository.findAll().stream()
                .filter(a -> "ACTIVE".equals(a.getStatus())
                        && (a.getAssignedOfficerId() == null || a.getAssignedOfficerId().equals(officerId)))
                .toList();
    }

    @PostMapping("/sos/{id}/status")
    public ResponseEntity<?> resolveSOS(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {

        SOSAlert alert = sosAlertRepository.findById(id).orElseThrow();
        User officer = getOfficer();
        if (alert.getAssignedOfficerId() != null && !alert.getAssignedOfficerId().equals(officer.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "This SOS alert is assigned to another officer"));
        }
        String status = body.get("status");
        if (status == null || (!status.equals("RESOLVED") && !status.equals("FALSE_ALARM"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
        if (alert.getAssignedOfficerId() == null) {
            alert.setAssignedOfficerId(officer.getId());
            alert.setAssignedOfficerName(officer.getName());
        }
        alert.setStatus(status);
        sosAlertRepository.save(alert);
        return ResponseEntity.ok(Map.of("message", "SOS Status Updated", "status", status));
    }

    // --- Vehicle System (Challan) ---
    @GetMapping("/vehicle/{vehicleNumber}")
    public ResponseEntity<?> findUserByVehicle(@PathVariable("vehicleNumber") String vehicleNumber) {

        return userRepository.findByVehicleNumberIgnoreCase(vehicleNumber)
                .map(user -> ResponseEntity.ok(Map.of(
                        "name", user.getName(),
                        "id", user.getId(),
                        "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "Hidden")))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/challan")

    public ResponseEntity<?> issueChallan(@RequestBody Map<String, String> body) {
        Challan challan = new Challan();
        challan.setVehicleNumber(body.get("vehicleNumber"));
        challan.setReason(body.get("reason"));
        challan.setAmount(body.get("amount"));
        challan.setStatus("Unpaid");
        challan.setDate(LocalDate.now());

        // auto-link if user registered with vehicle
        userRepository.findByVehicleNumberIgnoreCase(challan.getVehicleNumber()).ifPresent(challan::setUser);

        challanRepository.save(challan);
        return ResponseEntity.ok(challan);
    }
}
