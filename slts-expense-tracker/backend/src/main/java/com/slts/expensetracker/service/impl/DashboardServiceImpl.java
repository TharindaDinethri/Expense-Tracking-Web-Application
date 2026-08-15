package com.slts.expensetracker.service.impl;

import com.slts.expensetracker.dto.TransactionDtos.*;
import com.slts.expensetracker.entity.*;
import com.slts.expensetracker.exception.ApiException;
import com.slts.expensetracker.repository.*;
import com.slts.expensetracker.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.*;
import java.time.*;
import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository users;
    private final ExpenseRepository expenses;
    private final IncomeRepository incomes;

    public DashboardServiceImpl(
            UserRepository u,
            ExpenseRepository e,
            IncomeRepository i
    ) {
        users = u;
        expenses = e;
        incomes = i;
    }

    public DashboardResponse get(
            String email,
            int year,
            int month
    ) {
        Long uid = users
                .findByEmail(email)
                .orElseThrow(
                        () -> new ApiException(
                                "User not found",
                                HttpStatus.NOT_FOUND
                        )
                )
                .getId();

        YearMonth ym = YearMonth.of(year, month);

        LocalDate s = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal ti = zero(incomes.total(uid));
        BigDecimal te = zero(expenses.total(uid));

        BigDecimal mi = zero(
                incomes.totalBetween(uid, s, end)
        );

        BigDecimal me = zero(
                expenses.totalBetween(uid, s, end)
        );

        List<Object[]> cats = expenses.categoryTotals(
                uid,
                s,
                end
        );

        ListItem top = cats.isEmpty()
                ? new ListItem(
                        "None",
                        BigDecimal.ZERO
                )
                : new ListItem(
                        cats.get(0)[0].toString(),
                        (BigDecimal) cats.get(0)[1]
                );

        List<TransactionResponse> tx = new ArrayList<>();

        expenses
                .findTop10ByUserIdOrderByTransactionDateDescCreatedAtDesc(uid)
                .forEach(
                        x -> tx.add(
                                new TransactionResponse(
                                        "EXPENSE",
                                        x.getId(),
                                        x.getTitle(),
                                        x.getAmount(),
                                        x.getTransactionDate(),
                                        x.getCategory().name(),
                                        x.getNote()
                                )
                        )
                );

        incomes
                .findTop10ByUserIdOrderByReceivedDateDescCreatedAtDesc(uid)
                .forEach(
                        x -> tx.add(
                                new TransactionResponse(
                                        "INCOME",
                                        x.getId(),
                                        x.getSource(),
                                        x.getAmount(),
                                        x.getReceivedDate(),
                                        x.getSource(),
                                        x.getNote()
                                )
                        )
                );

        tx.sort(
                Comparator
                        .comparing(TransactionResponse::date)
                        .reversed()
        );

        return new DashboardResponse(
                ti,
                te,
                ti.subtract(te),
                mi,
                me,
                top.label(),
                top,
                tx.stream()
                        .limit(5)
                        .toList()
        );
    }

    private BigDecimal zero(BigDecimal x) {
        return x == null
                ? BigDecimal.ZERO
                : x;
    }
}