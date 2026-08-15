package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.TransactionDtos.*;
import com.slts.expensetracker.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService s;

    public IncomeController(IncomeService s) {
        this.s = s;
    }

    @PostMapping
    public IncomeResponse create(
            Authentication a,
            @Valid @RequestBody IncomeRequest r
    ) {
        return s.create(a.getName(), r);
    }

    @GetMapping
    public List<IncomeResponse> all(Authentication a) {
        return s.all(a.getName());
    }

    @PutMapping("/{id}")
    public IncomeResponse update(
            Authentication a,
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest r
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