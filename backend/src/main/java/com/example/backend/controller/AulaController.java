package com.example.backend.controller;

import com.example.backend.domain.Aula;
import com.example.backend.domain.Professor;
import com.example.backend.domain.Usuario;
import com.example.backend.repository.ProfessorRepository;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.service.AulaService;
import com.example.backend.service.NotificacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/aulas")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private NotificacaoService notificacaoService; // 👈 NOVO

    /**
     * POST /api/aulas
     *
     * JSON esperado no corpo:
     * {
     *   "alunoId": 5,
     *   "professorId": 3,
     *   "dataHora": "2025-06-15T14:30:00",
     *   "modalidade": "PRESENCIAL"
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<Aula> agendarAula(@Valid @RequestBody AulaRequestBody body) {
        Optional<Usuario> optAluno = usuarioRepository.findById(body.getAlunoId());
        Optional<Professor> optProfessor = professorRepository.findById(body.getProfessorId());

        if (!optAluno.isPresent() || !optProfessor.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        Usuario aluno = optAluno.get();
        Professor professor = optProfessor.get();

        Aula novaAula = new Aula();
        novaAula.setAluno(aluno);
        novaAula.setProfessor(professor);
        novaAula.setDataHora(LocalDateTime.parse(body.getDataHora()));
        novaAula.setModalidade(body.getModalidade());

        Aula salva = aulaService.agendarAula(novaAula);

        // 👈 CRIAR NOTIFICAÇÃO PARA O PROFESSOR
        try {
            String dataHoraFormatada = salva.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm"));
            notificacaoService.notificarAulaAgendada(
                    professor.getUsuario().getId(),
                    aluno.getNome(),
                    dataHoraFormatada,
                    salva.getId()
            );
        } catch (Exception e) {
            // Log do erro, mas não falha o agendamento
            System.err.println("Erro ao criar notificação: " + e.getMessage());
        }

        URI uri = URI.create("/api/aulas/" + salva.getId());
        return ResponseEntity.created(uri).body(salva);
    }

    /**
     * GET /api/aulas/aluno
     * Retorna todas as aulas onde o aluno_id = ID do usuário que está logado.
     */
    @GetMapping("/aluno")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<Aula>> listarAulasDoAluno(Authentication authentication) {
        // authentication.getName() = e-mail do usuario
        String email = authentication.getName();
        Usuario u = usuarioRepository.findByEmail(email);
        if (u == null) {
            return ResponseEntity.status(401).build();
        }
        List<Aula> lista = aulaService.buscarAulasPorAlunoId(u.getId());
        return ResponseEntity.ok(lista);
    }

    /**
     * GET /api/aulas/professor
     * Retorna todas as aulas onde o professor_id = ID do professor vinculado ao usuário que está logado.
     */
    @GetMapping("/professor")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<Aula>> listarAulasDoProfessor(Authentication authentication) {
        String email = authentication.getName();
        Usuario u = usuarioRepository.findByEmail(email);
        Optional<Professor> optP = professorRepository.findByUsuarioId(u.getId());
        if (!optP.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Professor p = optP.get();
        List<Aula> lista = aulaService.buscarAulasPorProfessorId(p.getId());
        return ResponseEntity.ok(lista);
    }

    /**
     * DELETE /api/aulas/{id}
     * Cancela uma aula - tanto aluno quanto professor podem cancelar
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ALUNO') or hasRole('PROFESSOR')")
    public ResponseEntity<?> cancelarAula(@PathVariable Long id, Authentication authentication) {
        try {
            // Busca a aula
            Optional<Aula> optAula = aulaService.buscarPorId(id);
            if (optAula.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Aula aula = optAula.get();
            String emailLogado = authentication.getName();
            Usuario usuarioLogado = usuarioRepository.findByEmail(emailLogado);

            if (usuarioLogado == null) {
                return ResponseEntity.status(401).body("Usuário não encontrado");
            }

            // Verifica se o usuário tem permissão para cancelar esta aula
            boolean podeCanselar = false;
            Usuario usuarioParaNotificar = null;
            String tipoUsuarioQueCancelou = "";

            if ("ALUNO".equals(usuarioLogado.getRole())) {
                // Aluno pode cancelar se for o aluno da aula
                podeCanselar = aula.getAluno().getId().equals(usuarioLogado.getId());
                if (podeCanselar) {
                    usuarioParaNotificar = aula.getProfessor().getUsuario(); // Notifica o professor
                    tipoUsuarioQueCancelou = "aluno";
                }
            } else if ("PROFESSOR".equals(usuarioLogado.getRole())) {
                // Professor pode cancelar se for o professor da aula
                Optional<Professor> optProfessor = professorRepository.findByUsuarioId(usuarioLogado.getId());
                if (optProfessor.isPresent()) {
                    podeCanselar = aula.getProfessor().getId().equals(optProfessor.get().getId());
                    if (podeCanselar) {
                        usuarioParaNotificar = aula.getAluno(); // Notifica o aluno
                        tipoUsuarioQueCancelou = "professor";
                    }
                }
            }

            if (!podeCanselar) {
                return ResponseEntity.status(403).body("Você não tem permissão para cancelar esta aula");
            }

            // 👈 CRIAR NOTIFICAÇÃO ANTES DE CANCELAR
            try {
                if (usuarioParaNotificar != null) {
                    String dataHoraFormatada = aula.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm"));
                    notificacaoService.notificarAulaCancelada(
                            usuarioParaNotificar.getId(),
                            usuarioLogado.getNome(),
                            dataHoraFormatada,
                            tipoUsuarioQueCancelou
                    );
                }
            } catch (Exception e) {
                // Log do erro, mas não falha o cancelamento
                System.err.println("Erro ao criar notificação de cancelamento: " + e.getMessage());
            }

            // Cancela a aula
            aulaService.cancelarAula(id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cancelar aula: " + e.getMessage());
        }
    }

    // DTO interno para receber o JSON do POST /api/aulas
    public static class AulaRequestBody {
        private Long alunoId;
        private Long professorId;
        private String dataHora;   // ex.: "2025-06-15T14:30:00"
        private String modalidade; // "ONLINE" ou "PRESENCIAL"

        public Long getAlunoId() { return alunoId; }
        public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }
        public Long getProfessorId() { return professorId; }
        public void setProfessorId(Long professorId) { this.professorId = professorId; }
        public String getDataHora() { return dataHora; }
        public void setDataHora(String dataHora) { this.dataHora = dataHora; }
        public String getModalidade() { return modalidade; }
        public void setModalidade(String modalidade) { this.modalidade = modalidade; }
    }
}