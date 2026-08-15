package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.TransactionDtos.*;
import com.slts.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService s;

    public ExpenseController(ExpenseService s) {
        this.s = s;
    }

    @PostMapping
    public ExpenseResponse create(
            Authentication a,
            @Valid @RequestBody ExpenseRequest r
    ) {
        return s.create(a.getName(), r);
    }

    @GetMapping
    public List<ExpenseResponse> all(Authentication a) {
        return s.all(a.getName());
    }

    @PutMapping("/{id}")
    public ExpenseResponse update(
            Authentication a,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest r
    ) {
        return s.update(a.getName(), id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(
            Authentication a,
            @PathVariable Long id
    ) {
        s.delete(a.getName(), id);
    }
}