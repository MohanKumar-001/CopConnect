package com.copconnect.controller;

import com.copconnect.entity.Role;
import com.copconnect.entity.User;
import com.copconnect.repository.UserRepository;
import com.copconnect.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.copconnect.repository.CitizenDetailRepository citizenRepository;
    @Autowired
    private com.copconnect.repository.OfficerDetailRepository officerRepository;
    @Autowired
    private com.copconnect.repository.AdminDetailRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Incorrect email or password"));
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));
        final String jwt = jwtUtil.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/{role}")
    public ResponseEntity<?> register(@PathVariable("role") String role, @RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isBlank() || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            user.setRole(Role.valueOf(role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
        if (user.getRole() != Role.USER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only citizen accounts can be created through public registration");
        }
        User savedUser = userRepository.save(user);

        // Save to specialized table
        if (savedUser.getRole() == Role.USER) {
            com.copconnect.entity.CitizenDetail detail = new com.copconnect.entity.CitizenDetail();
            detail.setUserId(savedUser.getId());
            detail.setName(savedUser.getName());
            detail.setPhoneNumber(savedUser.getPhoneNumber());
            detail.setAadhaar(savedUser.getAadhaar());
            detail.setVehicleNumber(savedUser.getVehicleNumber());
            citizenRepository.save(detail);
        } else if (savedUser.getRole() == Role.OFFICER) {
            com.copconnect.entity.OfficerDetail detail = new com.copconnect.entity.OfficerDetail();
            detail.setUserId(savedUser.getId());
            detail.setName(savedUser.getName());
            detail.setPhoneNumber(savedUser.getPhoneNumber());
            detail.setBadgeNumber(savedUser.getBadgeNumber());
            officerRepository.save(detail);
        } else if (savedUser.getRole() == Role.ADMIN) {
            com.copconnect.entity.AdminDetail detail = new com.copconnect.entity.AdminDetail();
            detail.setUserId(savedUser.getId());
            detail.setName(savedUser.getName());
            adminRepository.save(detail);
        }

        return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
    }

}
