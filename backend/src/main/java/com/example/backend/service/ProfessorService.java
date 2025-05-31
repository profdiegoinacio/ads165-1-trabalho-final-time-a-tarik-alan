package com.example.backend.service;

import com.example.backend.domain.Professor;
import com.example.backend.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository repo;

    public List<Professor> listarTodos() {
        return repo.findAll();
    }

    public Optional<Professor> buscarPorId(Long id) {
        return repo.findById(id);
    }

    public Professor criar(Professor p) {
        return repo.save(p);
    }

    public Professor atualizar(Long id, Professor p) {
        Optional<Professor> existenteOpt = repo.findById(id);
        if (existenteOpt.isEmpty()) {
            throw new RuntimeException("Professor não encontrado");
        }
        Professor existente = existenteOpt.get();
        existente.setNome(p.getNome());
        existente.setMateria(p.getMateria());
        existente.setValorHora(p.getValorHora());
        existente.setDisponibilidade(p.getDisponibilidade());
        return repo.save(existente);
    }

    public void deletar(Long id) {
        repo.deleteById(id);
    }

    /*** MÉTODO NOVO: lista apenas professores cuja disponibilidade seja “DISPONIVEL” ***/
    public List<Professor> listarDisponiveis() {
        return repo.findByDisponibilidadeIgnoreCase("DISPONIVEL");
    }

    /**
     * Busca com filtros opcionais (mantivemos seu código original)
     */
    public List<Professor> buscarComFiltro(
            String materia,
            Double minValor,
            Double maxValor,
            String disponibilidade
    ) {
        return repo.findAll().stream()
                .filter(p -> materia == null
                        || p.getMateria().toLowerCase().contains(materia.toLowerCase()))
                .filter(p -> minValor == null
                        || p.getValorHora() >= minValor)
                .filter(p -> maxValor == null
                        || p.getValorHora() <= maxValor)
                .filter(p -> disponibilidade == null
                        || p.getDisponibilidade().toLowerCase()
                        .contains(disponibilidade.toLowerCase()))
                .collect(Collectors.toList());
    }
}
