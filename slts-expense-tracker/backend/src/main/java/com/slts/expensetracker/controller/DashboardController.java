package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.TransactionDtos.DashboardResponse;
import com.slts.expensetracker.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService s;

    public DashboardController(DashboardService s) {
        this.s = s;
    }

    @GetMapping
    public DashboardResponse get(
            Authentication a,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        YearMonth now = YearMonth.now();

        return s.get(
                a.getName(),
                year == null ? now.getYear() : year,
                month == null ? now.getMonthValue() : month
        );
    }
}