package com.example.backend.dto;

import com.example.backend.model.PerfilUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CadastroRequest {
    private String nome;
    private String email;
    private String senha;
    private PerfilUsuario perfil;
}
