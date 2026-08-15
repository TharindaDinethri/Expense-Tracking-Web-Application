package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.AuthDtos.*;
import com.slts.expensetracker.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService s) {
        service = s;
    }

    @PostMapping("/register")
    public AuthResponse register(
        @Valid @RequestBody RegisterRequest r
    ) {
        return service.register(r);
    }

    @PostMapping("/login")
    public AuthResponse login(
        @Valid @RequestBody LoginRequest r
    ) {
        return service.login(r);
    }

    @GetMapping("/profile")
    public UserResponse profile(
        Authentication authentication
    ) {
        return service.profile(authentication.getName());
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
        Authentication authentication,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        return service.updateProfile(
            authentication.getName(),
            request
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(
        @Valid @RequestBody ForgotPasswordRequest r
    ) {

        service.requestOtp(r.email());

        return ResponseEntity.ok(
            java.util.Map.of(
                "message",
                "If the email exists, an OTP has been sent."
            )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(
        @Valid @RequestBody ResetPasswordRequest r
    ) {

        service.resetPassword(r);

        return ResponseEntity.ok(
            java.util.Map.of(
                "message",
                "Password reset successful."
            )
        );
    }
}