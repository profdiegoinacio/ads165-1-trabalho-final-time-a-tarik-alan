package com.example.backend.repository;

import com.example.backend.domain.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AulaRepository extends JpaRepository<Aula, Long> {
    // Busca todas as aulas onde o professor_id = ?
    List<Aula> findByProfessorId(Long professorId);

    // Busca todas as aulas onde o aluno_id = ?
    List<Aula> findByAlunoId(Long alunoId);
}
