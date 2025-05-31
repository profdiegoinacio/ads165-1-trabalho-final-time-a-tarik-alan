package com.example.backend.service;

import com.example.backend.domain.Usuario;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação de UserDetailsService que carrega o usuário a partir do e-mail
 * e converte o campo “role” em GrantedAuthority para o Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário pelo e-mail (ou throw se não existir)
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email);
        }

        // Converte a role (string “ALUNO” ou “PROFESSOR”) em GrantedAuthority
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getRole());

        // Retorna o UserDetails do Spring contendo e-mail, senha e authorities
        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getSenha(),
                List.of(authority)
        );
    }
}
