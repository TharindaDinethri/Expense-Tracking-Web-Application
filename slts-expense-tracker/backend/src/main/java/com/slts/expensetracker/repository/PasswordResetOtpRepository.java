package com.slts.expensetracker.repository;

import com.slts.expensetracker.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndUsedFalseOrderByIdDesc(
            String email
    );

    void deleteByEmail(String email);
}