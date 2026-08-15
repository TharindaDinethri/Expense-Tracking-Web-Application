package com.slts.expensetracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "password_reset_otps",
        indexes = @Index(
                name = "idx_otp_email",
                columnList = "email"
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 150)
    String email;

    @Column(nullable = false, length = 64)
    String otpHash;

    @Column(nullable = false)
    LocalDateTime expiresAt;

    @Column(nullable = false)
    boolean used;
}