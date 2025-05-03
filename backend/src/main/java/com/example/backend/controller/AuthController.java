package com.example.backend.controller;

import com.example.backend.dto.CadastroRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CadastroRequest cadastroRequest) {
        return authService.register(cadastroRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/login/validate")
    public ResponseEntity<?> loginValidation(@RequestHeader("Authentication") String token) {
        return authService.loginValidate(token);
    }

}
