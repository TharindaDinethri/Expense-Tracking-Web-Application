package com.slts.expensetracker.service;

import com.slts.expensetracker.dto.TransactionDtos.DashboardResponse;

public interface DashboardService {

    DashboardResponse get(
            String email,
            int year,
            int month
    );
}