package com.example.backend.service;

import com.example.backend.dto.CadastroRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.Usuario;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<?> register(CadastroRequest cadastroRequest) {
        // Verifica se o e-mail já está cadastrado
        if (usuarioRepository.existsByEmail(cadastroRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro: E-mail já cadastrado!");
        }

        // Cria um novo usuário
        Usuario usuario = new Usuario(
                cadastroRequest.getNome(),
                cadastroRequest.getEmail(),
                passwordEncoder.encode(cadastroRequest.getSenha()) // Senha criptografada
        );

        // Salva o usuário no banco de dados
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        // Procura o usuário pelo e-mail
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuario == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro: Usuário não encontrado!");
        }

        // Verifica se a senha está correta
        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro: Senha incorreta!");
        }

        // Aqui deveria retornar um token JWT, mas vamos deixar simples por enquanto
        return ResponseEntity.ok("Login realizado com sucesso!");
    }
}
