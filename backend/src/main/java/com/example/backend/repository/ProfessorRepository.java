package com.example.backend.repository;

import com.example.backend.domain.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    // List<Professor> findByMateria(String materia);
    List<Professor> findByDisponibilidadeIgnoreCase(String disponibilidade);
}
