package com.slts.expensetracker.service;

import com.slts.expensetracker.dto.TransactionDtos.*;

import java.util.*;

public interface ExpenseService {

    ExpenseResponse create(
            String email,
            ExpenseRequest r
    );

    List<ExpenseResponse> all(
            String email
    );

    ExpenseResponse update(
            String email,
            Long id,
            ExpenseRequest r
    );

    void delete(
            String email,
            Long id
    );
}