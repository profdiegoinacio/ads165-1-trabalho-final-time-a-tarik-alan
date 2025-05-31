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
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<?> register(CadastroRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: e-mail já cadastrado!");
        }
        // Cria usuário com role (ALUNO ou PROFESSOR)
        Usuario u = new Usuario();
        u.setNome(req.getNome());
        u.setEmail(req.getEmail());
        u.setSenha(passwordEncoder.encode(req.getSenha()));

        // Define role em MAIÚSCULAS
        String requestedRole = req.getRole().toUpperCase();
        if ("PROFESSOR".equals(requestedRole)) {
            u.setRole("PROFESSOR");
        } else {
            u.setRole("ALUNO");
        }

        usuarioRepository.save(u);
        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }

    public ResponseEntity<?> login(LoginRequest req) {
        Usuario u = usuarioRepository.findByEmail(req.getEmail());
        if (u == null || !passwordEncoder.matches(req.getSenha(), u.getSenha())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Erro: credenciais inválidas!");
        }
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", u.getId(),
                "role", u.getRole()
        ));
    }
}
