package com.example.backend.service;

import com.example.backend.domain.Aula;
import com.example.backend.repository.AulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AulaService {

    @Autowired
    private AulaRepository repository;

    @Transactional(readOnly = true)
    public List<Aula> buscarAulasPorProfessorId(Long professorId) {
        return repository.findByProfessorId(professorId);
    }

    @Transactional(readOnly = true)
    public List<Aula> buscarAulasPorAlunoId(Long alunoId) {
        return repository.findByAlunoId(alunoId);
    }

    @Transactional(readOnly = true)
    public Optional<Aula> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Aula agendarAula(Aula aula) {
        return repository.save(aula);
    }

    @Transactional
    public void cancelarAula(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Aula não encontrada com ID: " + id);
        }
        repository.deleteById(id);
    }
}