package com.example.backend.service;

import com.example.backend.domain.Aula;
import com.example.backend.repository.AulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Transactional
    public Aula agendarAula(Aula aula) {
        return repository.save(aula);
    }
}
