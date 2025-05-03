package com.example.backend.repository;

import com.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email); // Verificar se email já existe

    Usuario findByEmail(String email);   // Buscar usuário por email
}
