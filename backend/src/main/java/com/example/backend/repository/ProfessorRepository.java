package com.example.backend.repository;

import com.example.backend.domain.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    // Aqui podemos adicionar consultas específicas, ex:
    // List<Professor> findByMateria(String materia);
}
