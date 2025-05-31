package com.example.backend.service;

import com.example.backend.domain.Aula;
import com.example.backend.domain.Usuario;
import com.example.backend.domain.Professor;
import com.example.backend.dto.AgendamentoRequest;
import com.example.backend.repository.AulaRepository;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepo;
    @Autowired
    private UsuarioRepository usuarioRepo;
    @Autowired
    private ProfessorRepository professorRepo;

    public List<Aula> listarTodos() {
        return aulaRepo.findAll();
    }

    public List<Aula> buscarPorAluno(Long alunoId) {
        return aulaRepo.findByAlunoId(alunoId);
    }

    public List<Aula> buscarPorProfessor(Long professorId) {
        return aulaRepo.findByProfessorId(professorId);
    }

    public Aula criar(AgendamentoRequest req) {
        Usuario aluno = usuarioRepo.findById(req.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Professor prof = professorRepo.findById(req.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        LocalDateTime dt = LocalDateTime.parse(req.getDataHora());
        Aula aula = new Aula(aluno, prof, dt, req.getModalidade());
        return aulaRepo.save(aula);
    }

    public void deletar(Long id) {
        aulaRepo.deleteById(id);
    }
}
