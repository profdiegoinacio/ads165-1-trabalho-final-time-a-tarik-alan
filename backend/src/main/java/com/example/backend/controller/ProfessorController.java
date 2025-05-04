package com.example.backend.controller;

import com.example.backend.domain.Professor;
import com.example.backend.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService service;

    @GetMapping
    public List<Professor> listar(
            @RequestParam(required = false) String materia,
            @RequestParam(required = false) Double minValor,
            @RequestParam(required = false) Double maxValor,
            @RequestParam(required = false) String disponibilidade
    ) {
        // se nenhum filtro for passado, cai no método sem filtros
        if (materia == null && minValor == null && maxValor == null && disponibilidade == null) {
            return service.listarTodos();
        }
        return service.buscarComFiltro(materia, minValor, maxValor, disponibilidade);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Professor> criar(@RequestBody Professor p) {
        Professor criado = service.criar(p);
        return ResponseEntity.ok(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizar(@PathVariable Long id,
                                               @RequestBody Professor p) {
        Professor atualizado = service.atualizar(id, p);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
