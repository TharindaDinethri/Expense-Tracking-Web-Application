package com.slts.expensetracker.dto;

import jakarta.validation.constraints.*;

public final class AuthDtos {

    private AuthDtos() {}

    public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String address,
        @Size(min = 8, max = 100) String password
    ) {}

    public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password
    ) {}

    public record AuthResponse(
        String token,
        UserResponse user
    ) {}

    public record UserResponse(
        Long id,
        String name,
        String email,
        String address,
        String createdAt,
        String profilePicture
    ) {}

    public record UpdateProfileRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Size(max = 255)
        String address,

        @Size(max = 3000000)
        String profilePicture
    ) {}

    public record ForgotPasswordRequest(
        @Email @NotBlank String email
    ) {}

    public record ResetPasswordRequest(
        @Email @NotBlank String email,
        @NotBlank @Pattern(regexp = "\\d{6}") String otp,
        @Size(min = 8, max = 100) String newPassword
    ) {}
}