package com.slts.expensetracker.dto;

import com.slts.expensetracker.entity.ExpenseCategory;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class TransactionDtos {

    private TransactionDtos() {
    }

    public record ExpenseRequest(
            @NotBlank String title,
            @NotNull ExpenseCategory category,
            @NotNull @DecimalMin("0.01") BigDecimal amount,
            @NotNull LocalDate transactionDate,
            @Size(max = 500) String note
    ) {
    }

    public record ExpenseResponse(
            Long id,
            String title,
            ExpenseCategory category,
            BigDecimal amount,
            LocalDate transactionDate,
            String note
    ) {
    }

    public record IncomeRequest(
            @NotBlank String source,
            @NotNull @DecimalMin("0.01") BigDecimal amount,
            @NotNull LocalDate receivedDate,
            @Size(max = 500) String note
    ) {
    }

    public record IncomeResponse(
            Long id,
            String source,
            BigDecimal amount,
            LocalDate receivedDate,
            String note
    ) {
    }

    public record TransactionResponse(
            String type,
            Long id,
            String title,
            BigDecimal amount,
            LocalDate date,
            String categoryOrSource,
            String note
    ) {
    }

    public record DashboardResponse(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal currentBalance,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            String highestExpenseCategory,
            ListItem highestExpenseCategoryTotal,
            java.util.List<TransactionResponse> latestTransactions
    ) {
    }

    public record ListItem(
            String label,
            BigDecimal total
    ) {
    }
}