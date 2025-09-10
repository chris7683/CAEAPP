package com.financialapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 30)
    private String type;

    @NotBlank
    @Size(max = 10)
    private String currency;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(precision = 14, scale = 2)
    private BigDecimal balance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Account() {
        this.createdAt = LocalDateTime.now();
    }

    public Account(Long userId, String name, String type, String currency, BigDecimal balance) {
        this();
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.currency = currency;
        this.balance = balance;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
