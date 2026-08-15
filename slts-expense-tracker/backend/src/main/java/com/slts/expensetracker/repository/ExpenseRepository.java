package com.slts.expensetracker.repository;

import com.slts.expensetracker.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findTop10ByUserIdOrderByTransactionDateDescCreatedAtDesc(
            Long userId
    );

    List<Expense> findByUserIdOrderByTransactionDateDescCreatedAtDesc(
            Long userId
    );

    Optional<Expense> findByIdAndUserId(
            Long id,
            Long userId
    );

    @Query("""
            select coalesce(sum(e.amount), 0)
            from Expense e
            where e.user.id = :uid
            """)
    BigDecimal total(
            @Param("uid") Long uid
    );

    @Query("""
            select coalesce(sum(e.amount), 0)
            from Expense e
            where e.user.id = :uid
            and e.transactionDate between :start and :end
            """)
    BigDecimal totalBetween(
            @Param("uid") Long uid,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("""
            select e.category as category,
                   coalesce(sum(e.amount), 0) as total
            from Expense e
            where e.user.id = :uid
            and e.transactionDate between :start and :end
            group by e.category
            order by sum(e.amount) desc
            """)
    List<Object[]> categoryTotals(
            @Param("uid") Long uid,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}