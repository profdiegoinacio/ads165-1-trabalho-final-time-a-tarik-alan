// backend/src/main/java/com/example/backend/controller/UsuarioController.java
package com.example.backend.controller;

import com.example.backend.domain.Usuario;
import com.example.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
     * Atualizar perfil (apenas nome e email) - NOVO ENDPOINT ESPECÍFICO
     */
    @PutMapping("/{id}/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> atualizarPerfil(
            @PathVariable Long id,
            @RequestBody Map<String, String> dados,
            Authentication authentication) {

        try {
            // Verifica se o usuário está tentando editar seu próprio perfil
            String emailLogado = authentication.getName();
            Usuario usuarioLogado = service.buscarPorEmail(emailLogado);

            if (usuarioLogado == null || !usuarioLogado.getId().equals(id)) {
                return ResponseEntity.status(403).body("Você só pode editar seu próprio perfil");
            }

            String novoNome = dados.get("nome");
            String novoEmail = dados.get("email");

            if (novoNome == null || novoNome.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome é obrigatório");
            }

            if (novoEmail == null || novoEmail.trim().isEmpty() || !novoEmail.contains("@")) {
                return ResponseEntity.badRequest().body("Email inválido");
            }

            // Verifica se o novo email já existe (e não é do próprio usuário)
            Usuario usuarioComEmail = service.buscarPorEmail(novoEmail.trim());
            if (usuarioComEmail != null && !usuarioComEmail.getId().equals(id)) {
                return ResponseEntity.badRequest().body("Este email já está em uso por outro usuário");
            }

            Usuario atualizado = service.atualizarPerfil(id, novoNome.trim(), novoEmail.trim());
            return ResponseEntity.ok("Perfil atualizado com sucesso!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar perfil: " + e.getMessage());
        }
    }

    /**
     * Atualizar (método original - mantido para compatibilidade):
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