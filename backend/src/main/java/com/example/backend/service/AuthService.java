package com.example.backend.service;

import com.example.backend.dto.CadastroRequest;
import com.example.backend.dto.CadastroResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.model.ErrorResponse;
import com.example.backend.model.Usuario;
import com.example.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    public ResponseEntity<?> register(CadastroRequest cadastroRequest) {
        // Verifica se o e-mail já está cadastrado
//        if(usuarioRepository.findByEmail(cadastroRequest.getEmail()) != null)
        if (usuarioRepository.existsByEmail(cadastroRequest.getEmail())) {
            log.warn("WARN - Email de usuario enviado ja existe no banco de dados - {}", cadastroRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("Erro: E-mail já cadastrado!"));
        }

        // Cria um novo usuário
        Usuario usuario = new Usuario(
                cadastroRequest.getNome(),
                cadastroRequest.getEmail(),
                cadastroRequest.getSenha()
        );

        // Salva o usuário no banco de dados
        usuarioRepository.save(usuario);

//        return ResponseEntity.ok("Usuário registrado com sucesso!");
//        return ResponseEntity.noContent().build();
//        return ResponseEntity.status(HttpStatus.CREATED.value()).build();
        return ResponseEntity.status(HttpStatus.CREATED.value()).body(new CadastroResponse(usuario.getId().toString(), usuario.getNome(), usuario.getEmail()));
    }

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        // Procura o usuário pelo e-mail
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuario == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("Erro: Usuário não encontrado!"));
        }

        // Verifica se a senha está correta
        if (!usuario.getSenha().equals(loginRequest.getSenha())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("Erro: Senha incorreta!"));
        }

        // Aqui deveria retornar um token JWT, mas vamos deixar simples por enquanto
//        return ResponseEntity.ok("Login realizado com sucesso!");
        return ResponseEntity.ok(new LoginResponse(JwtImplementation.generateToken(usuario.getNome())));
    }

    public ResponseEntity<?> loginValidate(String token) {
        try {
            JwtImplementation.validateToken(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Token de autenticação inválido!"));
        }
        return ResponseEntity.noContent().build();
    }
}
