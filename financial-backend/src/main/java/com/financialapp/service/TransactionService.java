package com.financialapp.service;

import com.financialapp.model.Transaction;
import com.financialapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}
