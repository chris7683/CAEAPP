package com.financialapp.controller;

import com.financialapp.model.Account;
import com.financialapp.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts(Authentication authentication) {
        try {
            // In a real app, you'd get userId from JWT token
            // For now, we'll use a hardcoded user ID (23) from our test data
            Long userId = 23L;
            List<Account> accounts = accountService.getAccountsByUserId(userId);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
