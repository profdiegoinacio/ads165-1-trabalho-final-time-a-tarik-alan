package com.example.backend.controller;

import com.example.backend.domain.Notificacao;
import com.example.backend.domain.Usuario;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * GET /api/notificacoes
     * Busca todas as notificações do usuário logado
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notificacao>> buscarNotificacoes(Authentication authentication) {
        try {
            Usuario usuario = getUsuarioLogado(authentication);
            List<Notificacao> notificacoes = notificacaoService.buscarNotificacoesPorUsuario(usuario.getId());
            return ResponseEntity.ok(notificacoes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/notificacoes/nao-lidas
     * Busca apenas notificações não lidas
     */
    @GetMapping("/nao-lidas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notificacao>> buscarNotificacaoesNaoLidas(Authentication authentication) {
        try {
            Usuario usuario = getUsuarioLogado(authentication);
            List<Notificacao> notificacoes = notificacaoService.buscarNotificacaoesNaoLidas(usuario.getId());
            return ResponseEntity.ok(notificacoes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/notificacoes/count
     * Conta quantas notificações não lidas o usuário tem
     */
    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> contarNotificacaoesNaoLidas(Authentication authentication) {
        try {
            Usuario usuario = getUsuarioLogado(authentication);
            Long count = notificacaoService.contarNotificacaoesNaoLidas(usuario.getId());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/notificacoes/{id}/lida
     * Marca uma notificação como lida
     */
    @PutMapping("/{id}/lida")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> marcarComoLida(@PathVariable Long id, Authentication authentication) {
        try {
            // TODO: Verificar se a notificação pertence ao usuário logado
            notificacaoService.marcarComoLida(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao marcar notificação como lida");
        }
    }

    /**
     * PUT /api/notificacoes/marcar-todas-lidas
     * Marca todas as notificações do usuário como lidas
     */
    @PutMapping("/marcar-todas-lidas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> marcarTodasComoLidas(Authentication authentication) {
        try {
            Usuario usuario = getUsuarioLogado(authentication);
            notificacaoService.marcarTodasComoLidas(usuario.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao marcar notificações como lidas");
        }
    }

    /**
     * DELETE /api/notificacoes/{id}
     * Remove uma notificação
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletarNotificacao(@PathVariable Long id) {
        try {
            // TODO: Verificar se a notificação pertence ao usuário logado
            notificacaoService.deletarNotificacao(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar notificação");
        }
    }

    /**
     * Método helper para pegar o usuário logado
     */
    private Usuario getUsuarioLogado(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return usuario;
    }
}