package com.slts.expensetracker.service;

import com.slts.expensetracker.dto.TransactionDtos.ExpenseRequest;
import com.slts.expensetracker.entity.*;
import com.slts.expensetracker.repository.*;
import com.slts.expensetracker.service.impl.ExpenseServiceImpl;

import org.junit.jupiter.api.*;
import org.mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExpenseServiceImplTest {

    @Mock
    ExpenseRepository repo;

    @Mock
    UserRepository users;

    ExpenseServiceImpl service;

    @BeforeEach
    void set() {
        MockitoAnnotations.openMocks(this);
        service = new ExpenseServiceImpl(repo, users);
    }

    @Test
    void createExpense() {

        User u = User
                .builder()
                .id(1L)
                .email("a@test.com")
                .build();

        when(users.findByEmail("a@test.com"))
                .thenReturn(Optional.of(u));

        Expense x = Expense
                .builder()
                .id(1L)
                .user(u)
                .title("Lunch")
                .category(ExpenseCategory.FOOD)
                .amount(new BigDecimal("12.50"))
                .transactionDate(LocalDate.now())
                .build();

        when(repo.save(any(Expense.class)))
                .thenReturn(x);

        var r = service.create(
                "a@test.com",
                new ExpenseRequest(
                        "Lunch",
                        ExpenseCategory.FOOD,
                        new BigDecimal("12.50"),
                        LocalDate.now(),
                        "note"
                )
        );

        assertEquals("Lunch", r.title());
        assertEquals(new BigDecimal("12.50"), r.amount());

        verify(repo).save(any(Expense.class));
    }
}