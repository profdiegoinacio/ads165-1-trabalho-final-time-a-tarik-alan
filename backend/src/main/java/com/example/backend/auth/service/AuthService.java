package com.example.backend.auth.service;

import com.example.backend.auth.dto.CadastroRequest;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.config.JwtUtil;
import com.example.backend.domain.Usuario;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<?> register(CadastroRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro: E-mail já cadastrado!");
        }
        Usuario u = new Usuario(
                req.getNome(),
                req.getEmail(),
                passwordEncoder.encode(req.getSenha())
        );
        usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso!"));
    }

    public ResponseEntity<?> login(LoginRequest req) {
        Usuario u = usuarioRepository.findByEmail(req.getEmail());
        if (u == null || !passwordEncoder.matches(req.getSenha(), u.getSenha())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Erro: credenciais inválidas!");
        }
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
