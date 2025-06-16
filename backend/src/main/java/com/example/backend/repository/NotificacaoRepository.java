// backend/src/main/java/com/example/backend/repository/NotificacaoRepository.java
package com.example.backend.repository;

import com.example.backend.domain.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    /**
     * Busca todas as notificações de um usuário, ordenadas por data (mais recentes primeiro)
     */
    List<Notificacao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    /**
     * Busca apenas notificações não lidas de um usuário
     */
    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(Long usuarioId);

    /**
     * Busca notificações lidas de um usuário
     */
    List<Notificacao> findByUsuarioIdAndLidaTrueOrderByDataCriacaoDesc(Long usuarioId);

    /**
     * Conta quantas notificações não lidas um usuário tem
     */
    @Query("SELECT COUNT(n) FROM Notificacao n WHERE n.usuario.id = :usuarioId AND n.lida = false")
    Long countNotificacaoesNaoLidas(@Param("usuarioId") Long usuarioId);

    /**
     * Conta total de notificações de um usuário
     */
    @Query("SELECT COUNT(n) FROM Notificacao n WHERE n.usuario.id = :usuarioId")
    Long countNotificacoesByUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Busca notificações por tipo
     */
    List<Notificacao> findByUsuarioIdAndTipoOrderByDataCriacaoDesc(Long usuarioId, String tipo);

    /**
     * Busca notificações não lidas de um tipo específico
     */
    List<Notificacao> findByUsuarioIdAndTipoAndLidaFalseOrderByDataCriacaoDesc(Long usuarioId, String tipo);

    /**
     * Busca as últimas N notificações de um usuário
     */
    @Query("SELECT n FROM Notificacao n WHERE n.usuario.id = :usuarioId ORDER BY n.dataCriacao DESC")
    List<Notificacao> findTopNotificacoesByUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Remove todas as notificações de um usuário (útil para limpeza)
     */
    void deleteByUsuarioId(Long usuarioId);

    /**
     * Remove notificações antigas (mais de X dias)
     */
    @Query("DELETE FROM Notificacao n WHERE n.dataCriacao < :dataLimite")
    void deleteNotificacaoesAntigas(@Param("dataLimite") java.time.LocalDateTime dataLimite);
}