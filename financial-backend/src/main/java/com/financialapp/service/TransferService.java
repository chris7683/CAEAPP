package com.financialapp.service;

import com.financialapp.dto.TransferRequest;
import com.financialapp.model.Account;
import com.financialapp.model.Transfer;
import com.financialapp.repository.AccountRepository;
import com.financialapp.repository.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransferService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransferRepository transferRepository;

    @Transactional
    public Transfer processTransfer(Long userId, TransferRequest transferRequest) {
        // Get accounts
        Account fromAccount = accountRepository.findById(transferRequest.getFromAccountId())
            .orElseThrow(() -> new RuntimeException("From account not found"));
        
        Account toAccount = accountRepository.findById(transferRequest.getToAccountId())
            .orElseThrow(() -> new RuntimeException("To account not found"));

        // Verify ownership
        if (!fromAccount.getUserId().equals(userId)) {
            throw new RuntimeException("You can only transfer from your own accounts");
        }

        // Check sufficient funds
        if (fromAccount.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Check same account
        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }

        // Update balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(transferRequest.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(transferRequest.getAmount()));

        // Save accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transfer record
        Transfer transfer = new Transfer(
            userId,
            transferRequest.getFromAccountId(),
            transferRequest.getToAccountId(),
            transferRequest.getAmount(),
            transferRequest.getDescription()
        );

        return transferRepository.save(transfer);
    }
}
