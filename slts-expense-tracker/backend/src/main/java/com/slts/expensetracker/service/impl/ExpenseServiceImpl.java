package com.slts.expensetracker.service.impl;

import com.slts.expensetracker.dto.TransactionDtos.*;
import com.slts.expensetracker.entity.*;
import com.slts.expensetracker.exception.ApiException;
import com.slts.expensetracker.repository.*;
import com.slts.expensetracker.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repo;
    private final UserRepository users;

    public ExpenseServiceImpl(
            ExpenseRepository r,
            UserRepository u
    ) {
        repo = r;
        users = u;
    }

    private User user(String e) {
        return users
                .findByEmail(e)
                .orElseThrow(
                        () -> new ApiException(
                                "User not found",
                                HttpStatus.NOT_FOUND
                        )
                );
    }

    private ExpenseResponse dto(Expense x) {
        return new ExpenseResponse(
                x.getId(),
                x.getTitle(),
                x.getCategory(),
                x.getAmount(),
                x.getTransactionDate(),
                x.getNote()
        );
    }

    public ExpenseResponse create(
            String e,
            ExpenseRequest r
    ) {
        Expense x = Expense
                .builder()
                .user(user(e))
                .title(r.title())
                .category(r.category())
                .amount(r.amount())
                .transactionDate(r.transactionDate())
                .note(r.note())
                .build();

        return dto(repo.save(x));
    }

    public List<ExpenseResponse> all(String e) {
        return repo
                .findByUserIdOrderByTransactionDateDescCreatedAtDesc(
                        user(e).getId()
                )
                .stream()
                .map(this::dto)
                .toList();
    }

    public ExpenseResponse update(
            String e,
            Long id,
            ExpenseRequest r
    ) {
        Expense x = repo
                .findByIdAndUserId(
                        id,
                        user(e).getId()
                )
                .orElseThrow(
                        () -> new ApiException(
                                "Expense not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        x.setTitle(r.title());
        x.setCategory(r.category());
        x.setAmount(r.amount());
        x.setTransactionDate(r.transactionDate());
        x.setNote(r.note());

        return dto(repo.save(x));
    }

    public void delete(
            String e,
            Long id
    ) {
        Expense x = repo
                .findByIdAndUserId(
                        id,
                        user(e).getId()
                )
                .orElseThrow(
                        () -> new ApiException(
                                "Expense not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        repo.delete(x);
    }
}