package com.example.backend.service;

import com.example.backend.domain.Professor;
import com.example.backend.repository.ProfessorRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository repository;

    @Transactional(readOnly = true)
    public List<Professor> buscarProfessoresDisponiveis() {
        return repository.findByDisponibilidadeIgnoreCase("DISPONIVEL");
    }

    @Transactional(readOnly = true)
    public Optional<Professor> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Professor> buscarPorUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public Professor salvarOuAtualizar(Professor professor) {
        return repository.save(professor);
    }

    @Transactional
    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }
}
