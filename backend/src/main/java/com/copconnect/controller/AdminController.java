package com.copconnect.controller;

import com.copconnect.entity.SOSAlert;
import com.copconnect.entity.User;
import com.copconnect.entity.Role;
import com.copconnect.repository.SOSAlertRepository;
import com.copconnect.repository.UserRepository;
import com.copconnect.repository.ComplaintRepository;
import com.copconnect.repository.OfficerDetailRepository;
import com.copconnect.entity.Complaint;
import com.copconnect.entity.OfficerDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private SOSAlertRepository sosAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private OfficerDetailRepository officerDetailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/sos-alerts")
    public List<SOSAlert> getAllSOS() {
        return sosAlertRepository.findAll();
    }

    @PostMapping("/sos/{id}/assign")
    public ResponseEntity<?> assignOfficer(@PathVariable("id") Long id, @RequestBody Map<String, Object> body) {

        SOSAlert alert = sosAlertRepository.findById(id).orElseThrow();
        Long officerId = Long.valueOf(body.get("officerId").toString());
        User officer = userRepository.findById(officerId).orElseThrow();

        if (officer.getRole() != Role.OFFICER) {
            return ResponseEntity.badRequest().body("User is not an officer");
        }

        alert.setAssignedOfficerId(officerId);
        alert.setAssignedOfficerName(officer.getName());
        sosAlertRepository.save(alert);

        return ResponseEntity.ok(alert);
    }

    @GetMapping("/officers")
    public List<User> getAllOfficers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.OFFICER)
                .toList();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping("/officers")
    public ResponseEntity<?> createOfficer(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        String phoneNumber = body.getOrDefault("phoneNumber", "").trim();
        String badgeNumber = body.getOrDefault("badgeNumber", "").trim();

        if (name.isBlank() || email.isBlank() || password.length() < 8 || badgeNumber.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Name, email, badge number, and a password of at least 8 characters are required");
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already taken");
        }

        User officer = new User();
        officer.setName(name);
        officer.setEmail(email);
        officer.setPassword(passwordEncoder.encode(password));
        officer.setPhoneNumber(phoneNumber);
        officer.setBadgeNumber(badgeNumber);
        officer.setRole(Role.OFFICER);
        User savedOfficer = userRepository.save(officer);

        OfficerDetail detail = new OfficerDetail();
        detail.setUserId(savedOfficer.getId());
        detail.setName(savedOfficer.getName());
        detail.setPhoneNumber(savedOfficer.getPhoneNumber());
        detail.setBadgeNumber(savedOfficer.getBadgeNumber());
        officerDetailRepository.save(detail);

        return ResponseEntity.ok(savedOfficer);
    }
}
