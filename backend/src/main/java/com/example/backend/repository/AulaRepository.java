package com.example.backend.repository;

import com.example.backend.domain.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AulaRepository extends JpaRepository<Aula, Long> {
    List<Aula> findByAlunoId(Long alunoId);
    List<Aula> findByProfessorId(Long professorId);
}
