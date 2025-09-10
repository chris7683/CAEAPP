package com.financialapp.controller;

import com.financialapp.dto.TransferRequest;
import com.financialapp.model.Transfer;
import com.financialapp.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/transfers")
@CrossOrigin(origins = "*")
public class TransferController {
    
    @Autowired
    private TransferService transferService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> transferMoney(
            @RequestBody TransferRequest transferRequest,
            Authentication authentication) {
        try {
            // In a real app, you'd get userId from JWT token
            // For now, we'll use a hardcoded user ID (23) from our test data
            Long userId = 23L;
            
            Transfer transfer = transferService.processTransfer(userId, transferRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transfer completed successfully");
            response.put("transferId", transfer.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
