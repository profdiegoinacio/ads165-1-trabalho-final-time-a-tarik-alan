package com.example.backend.controller;

import com.example.backend.domain.Usuario;
import com.example.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    /**
     * Lista todos os usuários (caso só ADMIN possa ver, aplica @PreAuthorize):
     * @PreAuthorize("hasRole('ADMIN')")
     */
    @GetMapping
    @PreAuthorize("hasRole('PROFESSOR') or hasRole('ALUNO')") // Exemplo: qualquer autenticado
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    /**
     * Busca por ID
     * @PreAuthorize("principal.id == #id or hasRole('ADMIN')") // Exemplo se quiser controle fino
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        Optional<Usuario> u = service.buscarPorId(id);
        return u.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualizar (por padrão, TODO autenticado pode atualizar seu próprio cadastro):
     * @PreAuthorize("principal.id == #id")  // apenas o próprio usuário
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario u) {
        Usuario atualizado = service.atualizar(id, u);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Deletar usuário (só ADMIN ou próprio usuário):
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("principal.id == #id or hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
