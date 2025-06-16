package com.example.backend.service;

import com.example.backend.domain.Notificacao;
import com.example.backend.domain.Usuario;
import com.example.backend.repository.NotificacaoRepository;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Cria uma nova notificação
     */
    @Transactional
    public Notificacao criarNotificacao(Long usuarioId, String titulo, String mensagem, String tipo, Long aulaId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Notificacao notificacao = new Notificacao(usuario, titulo, mensagem, tipo, aulaId);
        return notificacaoRepository.save(notificacao);
    }

    /**
     * Busca todas as notificações de um usuário
     */
    @Transactional(readOnly = true)
    public List<Notificacao> buscarNotificacoesPorUsuario(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
    }

    /**
     * Busca apenas notificações não lidas
     */
    @Transactional(readOnly = true)
    public List<Notificacao> buscarNotificacaoesNaoLidas(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
    }

    /**
     * Conta notificações não lidas
     */
    @Transactional(readOnly = true)
    public Long contarNotificacaoesNaoLidas(Long usuarioId) {
        return notificacaoRepository.countNotificacaoesNaoLidas(usuarioId);
    }

    /**
     * Marca uma notificação como lida
     */
    @Transactional
    public void marcarComoLida(Long notificacaoId) {
        Optional<Notificacao> opt = notificacaoRepository.findById(notificacaoId);
        if (opt.isPresent()) {
            Notificacao notificacao = opt.get();
            notificacao.setLida(true);
            notificacaoRepository.save(notificacao);
        }
    }

    /**
     * Marca todas as notificações de um usuário como lidas
     */
    @Transactional
    public void marcarTodasComoLidas(Long usuarioId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
        notificacoes.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    /**
     * Remove uma notificação
     */
    @Transactional
    public void deletarNotificacao(Long notificacaoId) {
        notificacaoRepository.deleteById(notificacaoId);
    }

    /**
     * Métodos helper para criar notificações específicas de aulas
     */

    public void notificarAulaAgendada(Long professorUsuarioId, String nomeAluno, String dataHora, Long aulaId) {
        String titulo = "Nova Aula Agendada";
        String mensagem = String.format("O aluno %s agendou uma aula para %s", nomeAluno, dataHora);
        criarNotificacao(professorUsuarioId, titulo, mensagem, "AULA_AGENDADA", aulaId);
    }

    public void notificarAulaCancelada(Long usuarioId, String nomeUsuario, String dataHora, String tipoUsuario) {
        String titulo = "Aula Cancelada";
        String mensagem = String.format("O %s %s cancelou a aula de %s",
                tipoUsuario.toLowerCase(), nomeUsuario, dataHora);
        criarNotificacao(usuarioId, titulo, mensagem, "AULA_CANCELADA", null);
    }
}