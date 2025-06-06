package com.example.backend.auth.service;

import com.example.backend.auth.dto.CadastroRequest;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.config.JwtUtil;
import com.example.backend.domain.Usuario;
import com.example.backend.domain.Professor;
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
        // Verifica se já existe usuário com esse e-mail
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: e-mail já cadastrado!");
        }

        // Cria usuário com base nos dados da requisição
        Usuario u = new Usuario();
        u.setNome(req.getNome());
        u.setEmail(req.getEmail());
        u.setSenha(passwordEncoder.encode(req.getSenha()));

        // Define role (ALUNO ou PROFESSOR)
        String requestedRole = req.getRole().toUpperCase();
        if ("PROFESSOR".equals(requestedRole)) {
            u.setRole("PROFESSOR");
        } else {
            u.setRole("ALUNO");
        }

        // Se for PROFESSOR, cria um registro em 'professores' e já faz o vínculo 1:1
        if ("PROFESSOR".equals(u.getRole())) {
            Professor p = new Professor();
            // Define o nome do professor igual ao nome do usuário
            p.setNome(u.getNome());
            // Inicialmente, matéria e valorHora ficam nulos; disponibilidade já está "INDISPONIVEL"
            p.setMateria(null);
            p.setValorHora(null);
            // Disponibilidade padrão é "INDISPONIVEL", pois está declarado no atributo
            // p.setDisponibilidade("INDISPONIVEL"); // desnecessário, já vem automático

            // Faz o vínculo bidirecional
            p.setUsuario(u);
            u.setProfessor(p);
        }

        // Salva o usuário (caso seja professor, o cascade em Usuario -> Professor também salva Professor)
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
