package com.slts.expensetracker.repository;

import com.slts.expensetracker.entity.Income;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findTop10ByUserIdOrderByReceivedDateDescCreatedAtDesc(
            Long userId
    );

    List<Income> findByUserIdOrderByReceivedDateDescCreatedAtDesc(
            Long userId
    );

    Optional<Income> findByIdAndUserId(
            Long id,
            Long userId
    );

    @Query("select coalesce(sum(i.amount),0) from Income i where i.user.id=:uid")
    BigDecimal total(
            @Param("uid") Long uid
    );

    @Query("""
            select coalesce(sum(i.amount),0)
            from Income i
            where i.user.id=:uid
            and i.receivedDate between :start and :end
            """)
    BigDecimal totalBetween(
            @Param("uid") Long uid,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}