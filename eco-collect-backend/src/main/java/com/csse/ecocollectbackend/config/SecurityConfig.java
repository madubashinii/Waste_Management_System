package com.csse.ecocollectbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for API endpoints (MVP setup)
            .csrf(csrf -> csrf.disable())
            
            // Configure CORS
            .cors(cors -> {})
            
            // Configure session management - stateless for API
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Configure authorization - allow all for MVP
            .authorizeHttpRequests(auth -> auth
                // Allow all requests (MVP setup)
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
