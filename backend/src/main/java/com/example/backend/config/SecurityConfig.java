// backend/src/main/java/com/example/backend/config/SecurityConfig.java
package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Habilita @PreAuthorize
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) Desabilita CSRF (útil para APIs stateless com JWT)
                .csrf(csrf -> csrf.disable())
                // 2) Habilita CORS (configurado no bean abaixo)
                .cors(cors -> {})
                // 3) Define permissões de acesso para cada rota:
                .authorizeHttpRequests(auth -> auth
                        // 👈 ENDPOINTS DE AULAS
                        .requestMatchers(HttpMethod.POST, "/api/aulas").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET,  "/api/aulas/aluno").hasRole("ALUNO")
                        .requestMatchers(HttpMethod.GET,  "/api/aulas/professor").hasRole("PROFESSOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/aulas/**").authenticated()

                        // 👈 ENDPOINTS DE NOTIFICAÇÕES - NOVO
                        .requestMatchers(HttpMethod.GET, "/api/notificacoes/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/notificacoes/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/notificacoes/**").authenticated()

                        // Liberar endpoints de login e registro
                        .requestMatchers("/h2-console/**", "/api/auth/**").permitAll()

                        // Somente ALUNO pode ver lista de professores disponíveis
                        .requestMatchers(HttpMethod.GET, "/api/professores/disponiveis").hasRole("ALUNO")

                        // Somente PROFESSOR pode criar, atualizar e excluir professor
                        .requestMatchers("/api/professores/**").hasRole("PROFESSOR")

                        // Qualquer usuário autenticado (ALUNO ou PROFESSOR) pode listar TODOS os professores:
                        .requestMatchers(HttpMethod.GET, "/api/professores").authenticated()

                        // 👈 ENDPOINTS DE USUÁRIOS
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").authenticated()

                        // Qualquer outra rota requer autenticação
                        .anyRequest().authenticated()
                )
                // 4) Não criar sessão (API stateless com JWT):
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 5) Permite a console H2 rodar em iframe (caso use H2)
                .headers(headers -> headers.frameOptions().disable())
                // 6) Adiciona nosso filtro JWT antes do filtro padrão
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean para permitir requisições CORS do frontend (http://localhost:3000)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    // Expõe AuthenticationManager para que possa ser injetado se necessário
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}