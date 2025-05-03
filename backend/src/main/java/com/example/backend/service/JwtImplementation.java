package com.example.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@Slf4j
public class JwtImplementation {

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // chave secreta gerada automaticamente

    public static String generateToken(String username) {
        long nowMillis = System.currentTimeMillis();
        long expMillis = nowMillis + 3600_000; // 1 hora de validade

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(nowMillis))
                .setExpiration(new Date(expMillis))
                .signWith(key)
                .compact();
    }

    public static void validateToken(String token) {
        try {

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.debug("Token válido!");
            log.debug("Usuário: {}", claims.getSubject());
            log.debug("Emitido em: {}", claims.getIssuedAt());
            log.debug("Expira em: {}", claims.getExpiration());

        } catch (ExpiredJwtException e) {
            log.error("Token expirado!");
            throw e;
        } catch (SignatureException e) {
            log.error("Assinatura inválida!");
            throw e;
        } catch (Exception e) {
            log.error("Token inválido: {}", e.getMessage(), e);
            throw e;
        }
    }
}
