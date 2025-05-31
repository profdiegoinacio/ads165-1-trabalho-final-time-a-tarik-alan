// src/main/java/com/example/backend/config/BeanConfig.java
package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class BeanConfig {

    /**
     * Registra um bean BCryptPasswordEncoder para que o Spring o injete
     * sempre que alguém usar @Autowired private BCryptPasswordEncoder passwordEncoder;
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
