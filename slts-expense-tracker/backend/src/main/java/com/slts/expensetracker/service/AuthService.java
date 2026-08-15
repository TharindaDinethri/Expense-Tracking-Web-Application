package com.slts.expensetracker.service;

import com.slts.expensetracker.dto.AuthDtos.*;

public interface AuthService {

    AuthResponse register(RegisterRequest r);

    AuthResponse login(LoginRequest r);

    UserResponse profile(String email);

    UserResponse updateProfile(
        String email,
        UpdateProfileRequest request
    );

    void requestOtp(String email);

    void resetPassword(ResetPasswordRequest r);
}