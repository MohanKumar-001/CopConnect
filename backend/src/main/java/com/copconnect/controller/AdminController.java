package com.copconnect.controller;

import com.copconnect.entity.SOSAlert;
import com.copconnect.entity.User;
import com.copconnect.entity.Role;
import com.copconnect.repository.SOSAlertRepository;
import com.copconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
}
