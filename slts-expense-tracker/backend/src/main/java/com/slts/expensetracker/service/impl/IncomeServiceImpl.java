package com.slts.expensetracker.service.impl;

import com.slts.expensetracker.dto.TransactionDtos.*;
import com.slts.expensetracker.entity.*;
import com.slts.expensetracker.exception.ApiException;
import com.slts.expensetracker.repository.*;
import com.slts.expensetracker.service.IncomeService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository repo;
    private final UserRepository users;

    public IncomeServiceImpl(
            IncomeRepository r,
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

    private IncomeResponse dto(Income x) {
        return new IncomeResponse(
                x.getId(),
                x.getSource(),
                x.getAmount(),
                x.getReceivedDate(),
                x.getNote()
        );
    }

    public IncomeResponse create(
            String e,
            IncomeRequest r
    ) {
        Income x = Income
                .builder()
                .user(user(e))
                .source(r.source())
                .amount(r.amount())
                .receivedDate(r.receivedDate())
                .note(r.note())
                .build();

        return dto(repo.save(x));
    }

    public List<IncomeResponse> all(String e) {
        return repo
                .findByUserIdOrderByReceivedDateDescCreatedAtDesc(
                        user(e).getId()
                )
                .stream()
                .map(this::dto)
                .toList();
    }

    public IncomeResponse update(
            String e,
            Long id,
            IncomeRequest r
    ) {
        Income x = repo
                .findByIdAndUserId(
                        id,
                        user(e).getId()
                )
                .orElseThrow(
                        () -> new ApiException(
                                "Income not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        x.setSource(r.source());
        x.setAmount(r.amount());
        x.setReceivedDate(r.receivedDate());
        x.setNote(r.note());

        return dto(repo.save(x));
    }

    public void delete(
            String e,
            Long id
    ) {
        Income x = repo
                .findByIdAndUserId(
                        id,
                        user(e).getId()
                )
                .orElseThrow(
                        () -> new ApiException(
                                "Income not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        repo.delete(x);
    }
}