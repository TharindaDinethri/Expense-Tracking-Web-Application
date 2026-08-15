package com.slts.expensetracker.service;

import com.slts.expensetracker.entity.ExpenseCategory;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.repository.ExpenseRepository;
import com.slts.expensetracker.repository.IncomeRepository;
import com.slts.expensetracker.repository.UserRepository;
import com.slts.expensetracker.service.impl.DashboardServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class DashboardServiceImplTest {

    @Mock
    UserRepository users;

    @Mock
    ExpenseRepository expenses;

    @Mock
    IncomeRepository incomes;

    DashboardServiceImpl service;

    @BeforeEach
    void set() {
        MockitoAnnotations.openMocks(this);
        service = new DashboardServiceImpl(users, expenses, incomes);
    }

    @Test
    void calculatesBalanceAndMonthlyTotals() {

        User u = User.builder()
                .id(1L)
                .email("a@test.com")
                .build();

        when(users.findByEmail("a@test.com"))
                .thenReturn(Optional.of(u));

        when(incomes.total(1L))
                .thenReturn(new BigDecimal("5000"));

        when(expenses.total(1L))
                .thenReturn(new BigDecimal("1800"));

        when(incomes.totalBetween(eq(1L), any(), any()))
                .thenReturn(new BigDecimal("3000"));

        when(expenses.totalBetween(eq(1L), any(), any()))
                .thenReturn(new BigDecimal("900"));

        List<Object[]> categoryTotals = new ArrayList<>();
        categoryTotals.add(new Object[]{
            ExpenseCategory.FOOD,
            new BigDecimal("400")
        });

        when(expenses.categoryTotals(eq(1L), any(), any()))
                .thenReturn(categoryTotals);

        when(expenses.findTop10ByUserIdOrderByTransactionDateDescCreatedAtDesc(1L))
                .thenReturn(List.of());

        when(incomes.findTop10ByUserIdOrderByReceivedDateDescCreatedAtDesc(1L))
                .thenReturn(List.of());

        var d = service.get("a@test.com", 2026, 8);

        assertEquals(new BigDecimal("3200"), d.currentBalance());
        assertEquals(new BigDecimal("3000"), d.monthlyIncome());
        assertEquals("FOOD", d.highestExpenseCategory());
    }
}