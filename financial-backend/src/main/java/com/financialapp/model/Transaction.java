package com.financialapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Column(name = "account_id")
    private Long accountId;

    @NotBlank
    @Size(max = 10)
    @Column(name = "txn_type")
    private String txnType;

    @NotBlank
    @Size(max = 50)
    private String category;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    @Column(precision = 14, scale = 2)
    private BigDecimal amount;

    @Size(max = 255)
    private String description;

    @NotNull
    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;

    // Constructors
    public Transaction() {
        this.occurredAt = LocalDateTime.now();
    }

    public Transaction(Long userId, Long accountId, String txnType, String category, BigDecimal amount, String description) {
        this();
        this.userId = userId;
        this.accountId = accountId;
        this.txnType = txnType;
        this.category = category;
        this.amount = amount;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getTxnType() {
        return txnType;
    }

    public void setTxnType(String txnType) {
        this.txnType = txnType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(LocalDateTime occurredAt) {
        this.occurredAt = occurredAt;
    }
}
