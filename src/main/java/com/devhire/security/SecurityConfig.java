package com.devhire.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // Saved jobs - MUST COME FIRST
                        .requestMatchers(HttpMethod.POST, "/api/jobs/*/save")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.DELETE, "/api/jobs/*/save")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/jobs/saved")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/jobs/my")
                        .hasRole("RECRUITER")

                        // General job APIs
                        .requestMatchers(HttpMethod.GET, "/api/jobs/**")
                        .hasAnyRole("CANDIDATE", "RECRUITER")

                        .requestMatchers(HttpMethod.POST, "/api/jobs/**")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.PUT, "/api/jobs/**")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.DELETE, "/api/jobs/**")
                        .hasRole("RECRUITER")

                        // Applications
                        .requestMatchers(HttpMethod.POST, "/api/applications/jobs/**")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/applications/my")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/applications/job/**")
                        .hasRole("RECRUITER")

                        .requestMatchers(HttpMethod.PUT, "/api/applications/**")
                        .hasRole("RECRUITER")

                        // Resumes
                        .requestMatchers(HttpMethod.POST, "/api/resumes/upload")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/resumes/my")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.POST, "/api/resumes/**")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/dashboard/candidate")
                        .hasRole("CANDIDATE")

                        .requestMatchers(HttpMethod.GET, "/api/dashboard/recruiter")
                        .hasRole("RECRUITER")

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                // JWT = stateless authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Run JWT filter before Spring's username/password filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}