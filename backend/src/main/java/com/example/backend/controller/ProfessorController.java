package com.example.backend.controller;

import com.example.backend.domain.Professor;
import com.example.backend.service.ProfessorService;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para gerenciamento de Professores.
 */
@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService service;

    /**
     * GET /api/professores/disponiveis
     *
     * Retorna todos os professores cuja disponibilidade esteja igual a "DISPONIVEL".
     */
    @GetMapping("/disponiveis")
    public ResponseEntity<List<Professor>> listarDisponiveis() {
        List<Professor> lista = service.buscarProfessoresDisponiveis();
        return ResponseEntity.ok(lista);
    }

    /**
     * GET /api/professores/{id}
     *
     * Busca um professor pelo seu ID de tabela.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscarPorId(@PathVariable Long id) {
        Optional<Professor> opt = service.buscarPorId(id);
        return opt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /api/professores/usuario/{usuarioId}
     *
     * Busca o professor vinculado a um usuário (cada usuário-professor tem um registro de Professor),
     * usando o ID do usuário (usuarioId) para encontrar o Professor correspondente.
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Professor> buscarPorUsuarioId(@PathVariable Long usuarioId) {
        Optional<Professor> opt = service.buscarPorUsuarioId(usuarioId);
        return opt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/professores/{id}
     *
     * Atualiza o Professor com ID {id}.
     * Além de nome, matéria, valorHora e disponibilidade, agora
     * se o professor informar MATÉRIA e VALORHORA, a disponibilidade
     * passará automaticamente para "DISPONIVEL".
     *
     * Corpo JSON esperado (campos opcionais):
     * {
     *   "nome": "Novo Nome",
     *   "materia": "Matemática",
     *   "valorHora": 120.0,
     *   "disponibilidade": "INDISPONIVEL"   // ou "DISPONIVEL"
     * }
     *
     * Campos ausentes no JSON não serão alterados.
     * Se BOTH (matéria e valorHora) vierem não nulos, forçamos
     *       disponível = "DISPONIVEL".
     * Se ele quiser forçar indisponível manualmente (por ex., para férias),
     *       poderá enviar somente `"disponibilidade": "INDISPONIVEL"`.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizarProfessor(
            @PathVariable Long id,
            @RequestBody Professor dadosAtualizados) {

        Optional<Professor> optExistente = service.buscarPorId(id);
        if (optExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Professor existente = optExistente.get();

        // Atualiza nome se fornecido
        if (dadosAtualizados.getNome() != null) {
            existente.setNome(dadosAtualizados.getNome());
        }

        // Atualiza matéria se fornecido
        boolean mudouMateria = false;
        if (dadosAtualizados.getMateria() != null) {
            existente.setMateria(dadosAtualizados.getMateria());
            mudouMateria = true;
        }

        // Atualiza valorHora se fornecido
        boolean mudouValorHora = false;
        if (dadosAtualizados.getValorHora() != null) {
            existente.setValorHora(dadosAtualizados.getValorHora());
            mudouValorHora = true;
        }

        // Se BOTH (matéria e valorHora) vierem não nulos (ou seja, professor configurou ambos),
        // então ajustamos disponibilidade para "DISPONIVEL".
        if (mudouMateria && mudouValorHora) {
            existente.setDisponibilidade("DISPONIVEL");
        } else {
            // Se o JSON incluiu explicitly disponibilidade, respeitamos o que veio
            if (dadosAtualizados.getDisponibilidade() != null) {
                existente.setDisponibilidade(dadosAtualizados.getDisponibilidade());
            }
            // Caso contrário, não mexemos no campo disponibilidade (permanece o valor atual).
        }

        Professor atualizado = service.salvarOuAtualizar(existente);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * POST /api/professores
     *
     * (Opcional) Cria um novo professor manualmente.
     * Útil apenas se, além do cadastro automático via AuthService, você quiser
     * criar professores diretamente.
     */
    @PostMapping
    public ResponseEntity<Professor> criarProfessor(@RequestBody Professor novoProfessor) {
        Professor salvo = service.salvarOuAtualizar(novoProfessor);
        URI uri = URI.create("/api/professores/" + salvo.getId());
        return ResponseEntity.created(uri).body(salvo);
    }

    /**
     * DELETE /api/professores/{id}
     *
     * Deleta o professor com ID = {id}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Professor> optExistente = service.buscarPorId(id);
        if (optExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
