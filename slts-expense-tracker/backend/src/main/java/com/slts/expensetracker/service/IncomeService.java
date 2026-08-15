package com.slts.expensetracker.service;

import com.slts.expensetracker.dto.TransactionDtos.*;

import java.util.*;

public interface IncomeService {

    IncomeResponse create(
            String email,
            IncomeRequest r
    );

    List<IncomeResponse> all(
            String email
    );

    IncomeResponse update(
            String email,
            Long id,
            IncomeRequest r
    );

    void delete(
            String email,
            Long id
    );
}