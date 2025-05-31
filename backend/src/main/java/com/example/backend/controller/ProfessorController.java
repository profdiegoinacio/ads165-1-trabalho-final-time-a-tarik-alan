package com.example.backend.controller;

import com.example.backend.domain.Professor;
import com.example.backend.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService service;

    /**
     * LISTAGEM GERAL DE PROFESSORES
     * - Se solicitado com query params (materia, minValor, maxValor, disponibilidade), filtra.
     * - Caso contrário, retorna todos.
     * - Permitido a qualquer usuário autenticado (ALUNO ou PROFESSOR).
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Professor> listar(
            @RequestParam(required = false) String materia,
            @RequestParam(required = false) Double minValor,
            @RequestParam(required = false) Double maxValor,
            @RequestParam(required = false) String disponibilidade
    ) {
        if (materia == null && minValor == null && maxValor == null && disponibilidade == null) {
            return service.listarTodos();
        }
        return service.buscarComFiltro(materia, minValor, maxValor, disponibilidade);
    }

    /**
     * LISTA SÓ OS PROFESSORES DISPONÍVEIS
     * - Chamado apenas por ALUNO.
     */
    @GetMapping("/disponiveis")
    @PreAuthorize("hasRole('ALUNO')")
    public List<Professor> listarDisponiveis() {
        return service.listarTodos();
    }

    /**
     * BUSCAR PROFESSOR POR ID
     * - Permitido a qualquer usuário autenticado.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Professor> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * CRIAR NOVO PROFESSOR
     * - Somente PROFESSOR (role ROLE_PROFESSOR) pode acessar.
     */
    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Professor> criar(@RequestBody Professor p) {
        Professor criado = service.criar(p);
        return ResponseEntity.ok(criado);
    }

    /**
     * ATUALIZAR PROFESSOR EXISTENTE
     * - Somente PROFESSOR.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Professor> atualizar(
            @PathVariable Long id,
            @RequestBody Professor p
    ) {
        Professor atualizado = service.atualizar(id, p);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * DELETAR PROFESSOR
     * - Somente PROFESSOR.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
