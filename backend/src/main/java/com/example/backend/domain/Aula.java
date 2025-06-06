package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Entidade Aula (tabela "aulas").
 */
@Entity
@Table(name = "aulas")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Campo dataHora (ISO 8601).
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataHora;

    private String modalidade;

    /**
     * Cada Aula tem um Aluno (Usuario).
     * Aula → Usuario (aluno) como Many-to-One.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario aluno;

    /**
     * Cada Aula tem um Professor.
     * Aula → Professor como Many-to-One.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Professor professor;

    public Aula() {
    }

    public Aula(LocalDateTime dataHora, String modalidade, Usuario aluno, Professor professor) {
        this.dataHora = dataHora;
        this.modalidade = modalidade;
        this.aluno = aluno;
        this.professor = professor;
    }

    // ===== Getters e Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }

    public Usuario getAluno() {
        return aluno;
    }

    public void setAluno(Usuario aluno) {
        this.aluno = aluno;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }
}
