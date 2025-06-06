package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * Entidade Professor (tabela "professores").
 *
 * Agora, por padrão, qualquer Professor criado terá disponibilidade = "INDISPONIVEL".
 */
@Entity
@Table(name = "professores")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String materia;
    private Double valorHora;

    // Alterado de "DISPONIVEL" para "INDISPONIVEL" como valor padrão
    private String disponibilidade = "INDISPONIVEL";

    /**
     * Lado Owning do relacionamento One-to-One com Usuario.
     * Jackson ignora este campo para evitar recursão/deserialização de proxy.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    @JsonBackReference
    private Usuario usuario;

    public Professor() {
    }

    public Professor(String nome, String materia, Double valorHora, String disponibilidade, Usuario usuario) {
        this.nome = nome;
        this.materia = materia;
        this.valorHora = valorHora;
        this.disponibilidade = disponibilidade;
        this.usuario = usuario;
    }

    // ===== Getters e Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMateria() {
        return materia;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public Double getValorHora() {
        return valorHora;
    }

    public void setValorHora(Double valorHora) {
        this.valorHora = valorHora;
    }

    public String getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(String disponibilidade) {
        this.disponibilidade = disponibilidade;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
