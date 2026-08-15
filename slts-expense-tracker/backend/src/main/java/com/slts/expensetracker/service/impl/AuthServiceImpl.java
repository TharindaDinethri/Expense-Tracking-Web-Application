package com.slts.expensetracker.service.impl;

import com.slts.expensetracker.dto.AuthDtos.*;
import com.slts.expensetracker.entity.*;
import com.slts.expensetracker.exception.ApiException;
import com.slts.expensetracker.repository.*;
import com.slts.expensetracker.security.JwtService;
import com.slts.expensetracker.service.AuthService;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final PasswordResetOtpRepository otps;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final JavaMailSender mail;
    private final int otpMinutes;
    private final String mailFrom;


    public AuthServiceImpl(
        UserRepository u,
        PasswordResetOtpRepository o,
        PasswordEncoder e,
        JwtService j,
        JavaMailSender m,
        @Value("${app.otp.expiration-minutes}") int om,
        @Value("${spring.mail.username}") String mf
    ) { 
    users = u;
    otps = o;
    encoder = e;
    jwt = j;
    mail = m;
    otpMinutes = om;
    mailFrom = mf;
}

    @Override
    public AuthResponse register(RegisterRequest r) {

        if (users.existsByEmail(r.email().toLowerCase())) {
            throw new ApiException(
                "Email is already registered",
                HttpStatus.CONFLICT
            );
        }

        User u = User.builder()
            .name(r.name().trim())
            .email(r.email().toLowerCase())
            .address(r.address().trim())
            .password(encoder.encode(r.password()))
            .build();

        users.save(u);

        return response(u);
    }

    @Override
    public AuthResponse login(LoginRequest r) {

        User u = users.findByEmail(r.email().toLowerCase())
            .orElseThrow(() ->
                new ApiException(
                    "Invalid email or password",
                    HttpStatus.UNAUTHORIZED
                )
            );

        if (!encoder.matches(r.password(), u.getPassword())) {
            throw new ApiException(
                "Invalid email or password",
                HttpStatus.UNAUTHORIZED
            );
        }

        return response(u);
    }

    @Override
    public UserResponse profile(String email) {

        User user = users.findByEmail(email)
            .orElseThrow(() ->
                new ApiException(
                    "User not found",
                    HttpStatus.NOT_FOUND
                )
            );

        return toUser(user);
    }

    @Override
    public UserResponse updateProfile(
        String email,
        UpdateProfileRequest request
    ) {

        User user = users.findByEmail(email)
            .orElseThrow(() ->
                new ApiException(
                    "User not found",
                    HttpStatus.NOT_FOUND
                )
            );

        user.setName(request.name().trim());
        user.setAddress(request.address().trim());

        /*
         * If profilePicture is null, keep the existing picture.
         * If it is an empty string, remove the existing picture.
         */
        if (request.profilePicture() != null) {
            user.setProfilePicture(request.profilePicture());
        }

        users.save(user);

        return toUser(user);
    }

    @Override
    @Transactional
    public void requestOtp(String email) {

        String e = email.toLowerCase().trim();

        if (!users.existsByEmail(e)) {
            return;
        }

        String otp = String.format(
            "%06d",
            new Random().nextInt(1000000)
        );

        // Remove previous OTPs for this email
        otps.deleteByEmail(e);

        // Save new OTP
        PasswordResetOtp x = PasswordResetOtp.builder()
            .email(e)
            .otpHash(encoder.encode(otp))
            .expiresAt(
                LocalDateTime.now().plusMinutes(otpMinutes)
            )
            .used(false)
            .build();

        otps.save(x);

        // Send OTP email
        SimpleMailMessage msg = new SimpleMailMessage();

        msg.setFrom(mailFrom);
        msg.setTo(e);
        msg.setSubject("ExpenseFlow - Password Reset OTP");

        msg.setText(
            "Hello,\n\n"
            + "Your ExpenseFlow password reset OTP is:\n\n"
            + otp
            + "\n\n"
            + "This OTP is valid for "
            + otpMinutes
            + " minutes.\n\n"
            + "If you did not request a password reset, "
            + "you can safely ignore this email.\n\n"
            + "Regards,\n"
            + "ExpenseFlow"
        );

        mail.send(msg);

        // Keep this temporarily for testing
        System.out.println(
            "Password reset OTP sent to: " + e
        );

    }

    @Override
    public void resetPassword(ResetPasswordRequest r) {

        PasswordResetOtp x =
            otps.findTopByEmailAndUsedFalseOrderByIdDesc(
                r.email().toLowerCase()
            )
            .orElseThrow(() ->
                new ApiException(
                    "Invalid or expired OTP",
                    HttpStatus.BAD_REQUEST
                )
            );

        if (
            x.getExpiresAt().isBefore(LocalDateTime.now())
            || !encoder.matches(r.otp(), x.getOtpHash())
        ) {

            throw new ApiException(
                "Invalid or expired OTP",
                HttpStatus.BAD_REQUEST
            );
        }

        User u = users.findByEmail(
            r.email().toLowerCase()
        )
        .orElseThrow(() ->
            new ApiException(
                "User not found",
                HttpStatus.NOT_FOUND
            )
        );

        u.setPassword(
            encoder.encode(r.newPassword())
        );

        users.save(u);

        x.setUsed(true);
        otps.save(x);
    }

    private AuthResponse response(User u) {

        return new AuthResponse(
            jwt.generate(u.getId(), u.getEmail()),
            toUser(u)
        );
    }

    private UserResponse toUser(User u) {

        return new UserResponse(
            u.getId(),
            u.getName(),
            u.getEmail(),
            u.getAddress(),
            String.valueOf(u.getCreatedAt()),
            u.getProfilePicture()
        );
    }
}