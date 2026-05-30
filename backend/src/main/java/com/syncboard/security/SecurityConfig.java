package com.syncboard.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
    .cors(cors -> {})
    .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

        .requestMatchers(
        "/api/v1/auth/**",
        "/api/v1/health",
        "/test.html",
        "/ws/**"
)

        .permitAll()

        .requestMatchers(
                "/api/v1/user/admin"
        )

        .hasRole("ADMIN")

        .anyRequest()

        .authenticated()
)

                .addFilterBefore(
                        new JwtFilter(),
                        org.springframework.security.web.authentication
                                .UsernamePasswordAuthenticationFilter.class)

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
    @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration =
            new CorsConfiguration();

    configuration.setAllowedOrigins(

            List.of(
                    "http://localhost:5173"
            )
    );

    configuration.setAllowedMethods(

            List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
            )
    );

    configuration.setAllowedHeaders(

            List.of("*")
    );

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(

            "/**",

            configuration
    );

    return source;
}

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }
}