// backend/src/main/java/com/example/backend/service/UsuarioService.java
package com.example.backend.service;

import com.example.backend.domain.Usuario;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repo;

    public List<Usuario> listarTodos() {
        return repo.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repo.findById(id);
    }

    public Usuario criar(Usuario u) {
        return repo.save(u);
    }

    public Usuario atualizar(Long id, Usuario u) {
        // 1) Busca a entidade que já existe ou lança erro
        Usuario existente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para id: " + id));

        // 2) Atualiza apenas os campos desejados
        existente.setNome(u.getNome());
        existente.setEmail(u.getEmail());
        existente.setSenha(u.getSenha());

        // 3) Salva a mesma instância (faz UPDATE)
        return repo.save(existente);
    }

    /**
     * NOVO: Busca usuário por email
     */
    public Usuario buscarPorEmail(String email) {
        return repo.findByEmail(email);
    }

    /**
     * NOVO: Atualiza apenas nome e email (sem mexer na senha)
     */
    public Usuario atualizarPerfil(Long id, String novoNome, String novoEmail) {
        Usuario existente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para id: " + id));

        // Atualiza apenas nome e email, mantém senha e role originais
        existente.setNome(novoNome);
        existente.setEmail(novoEmail);
        // NÃO mexe na senha nem no role

        return repo.save(existente);
    }

    public void deletar(Long id) {
        repo.deleteById(id);
    }
}