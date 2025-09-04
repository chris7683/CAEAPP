package com.financialapp.controller;

import com.financialapp.dto.AuthResponse;
import com.financialapp.dto.LoginRequest;
import com.financialapp.dto.SignUpRequest;
import com.financialapp.model.User;
import com.financialapp.security.JwtUtil;
import com.financialapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(loginRequest.getEmail());

            User user = userService.findByEmail(loginRequest.getEmail());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getUsernameField(),
                    user.getPhoneNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User user = userService.createUser(signUpRequest);
            
            // Generate JWT token for the new user
            String jwt = jwtUtil.generateToken(user.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getUsernameField(),
                    user.getPhoneNumber()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is running!");
    }
}
