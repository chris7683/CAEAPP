package com.financialapp.service;

import com.financialapp.model.Account;
import com.financialapp.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId).orElse(null);
    }
}
