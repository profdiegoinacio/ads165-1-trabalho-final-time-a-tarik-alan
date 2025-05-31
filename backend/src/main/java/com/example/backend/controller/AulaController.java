package com.example.backend.controller;

import com.example.backend.domain.Aula;
import com.example.backend.domain.Usuario;
import com.example.backend.dto.AgendamentoRequest;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.service.AulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aulas")
public class AulaController {

    @Autowired
    private AulaService service;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * ALUNO agenda uma aula:
     * Recebe AgendamentoRequest { alunoId, professorId, dataHora, modalidade }.
     * O token no header determina quem é o aluno (email) e definimos o alunoId no front ou validamos aqui.
     */
    @PostMapping
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<?> criar(
            @RequestBody AgendamentoRequest req,
            Authentication authentication
    ) {
        // Validação adicional: podemos garantir que req.getAlunoId() corresponde ao usuário logado:
        String emailLogado = authentication.getName();
        Usuario aluno = usuarioRepository.findByEmail(emailLogado);
        if (aluno == null || !aluno.getId().equals(req.getAlunoId())) {
            return ResponseEntity.status(403).body("Aluno inválido ou não corresponde ao token.");
        }

        Aula aula = service.criar(req);
        return ResponseEntity.ok(aula);
    }

    /**
     * PROFESSOR vê todas as aulas agendadas para ele:
     * Usa token do professor (Authentication) para obter email e, então, o ID.
     */
    @GetMapping("/professor")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<Aula>> listarAulasDoProfessor(Authentication authentication) {
        String emailProfLogado = authentication.getName();
        Usuario prof = usuarioRepository.findByEmail(emailProfLogado);
        if (prof == null) {
            return ResponseEntity.status(404).build();
        }
        List<Aula> aulas = service.buscarPorProfessor(prof.getId());
        return ResponseEntity.ok(aulas);
    }

    /**
     * Deletar uma aula (opcional):
     * Você pode decidir que só o professor consiga deletar suas aulas, ou ambos (ALUNO pode cancelar).
     * Aqui, como exemplo, permitimos só PROFESSOR:
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // --- NOVO: ALUNO vê suas próprias aulas ---
    @GetMapping("/aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<Aula>> listarAulasDoAluno(Authentication authentication) {
        // Extrai e-mail do usuário logado via token
        String emailAlunoLogado = authentication.getName();
        Usuario aluno = usuarioRepository.findByEmail(emailAlunoLogado);
        if (aluno == null) {
            return ResponseEntity.status(404).build();
        }
        List<Aula> aulas = service.buscarPorAluno(aluno.getId());
        return ResponseEntity.ok(aulas);
    }
}
