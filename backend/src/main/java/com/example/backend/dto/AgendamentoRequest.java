package com.example.backend.dto;

public class AgendamentoRequest {
    private Long alunoId;
    private Long professorId;
    private String dataHora;    // formato ISO: "2025-05-10T14:30"
    private String modalidade;  // "online" ou "presencial"

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }
    public Long getProfessorId() { return professorId; }
    public void setProfessorId(Long professorId) { this.professorId = professorId; }
    public String getDataHora() { return dataHora; }
    public void setDataHora(String dataHora) { this.dataHora = dataHora; }
    public String getModalidade() { return modalidade; }
    public void setModalidade(String modalidade) { this.modalidade = modalidade; }
}
