package com.financialapp.controller;

import com.financialapp.model.Transaction;
import com.financialapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
        try {
            // In a real app, you'd get userId from JWT token
            // For now, we'll use a hardcoded user ID (23) from our test data
            Long userId = 23L;
            List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
