package sv.edu.esfe.segurodigital.config;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import sv.edu.esfe.segurodigital.domain.repository.AfiliadoRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecretKey jwtSecretKey(
            @Value("${app.jwt.secret}") String secret) {

        byte[] bytes = Base64.getDecoder().decode(secret);

        if (bytes.length < 32) {
            throw new IllegalArgumentException(
                    "JWT_SECRET debe contener al menos 32 bytes en Base64");
        }

        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(
                new ImmutableSecret<>(jwtSecretKey));
    }

    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey jwtSecretKey,
            @Value("${app.jwt.issuer}") String issuer) {

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(jwtSecretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        decoder.setJwtValidator(
                JwtValidators.createDefaultWithIssuer(issuer));

        return decoder;
    }

    @Bean
public UserDetailsService userDetailsService(
        AfiliadoRepository repository) {

    return numeroPoliza -> {
        var afiliado = repository
                .findByNumeroPoliza(numeroPoliza.trim())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Credenciales inválidas"));

        // La identidad autenticada será el ID del afiliado.
        return User.withUsername(afiliado.getId().toString())
                .password(afiliado.getPassword())
                .roles("AFILIADO")
                .build();
    };
}

@Bean
@Order(1)
public SecurityFilterChain apiSecurity(
        HttpSecurity http) throws Exception {

    http
        .securityMatcher("/api/**")
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session
                .sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/login").permitAll()
                .anyRequest().authenticated())
        .oauth2ResourceServer(oauth -> oauth
                .jwt(Customizer.withDefaults()));

    return http.build();
}

@Bean
@Order(2)
public SecurityFilterChain webSecurity(
        HttpSecurity http) throws Exception {

    http
        .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/", "/login", "/error",
                        "/css/**", "/js/**", "/images/**",
                        "/favicon.ico").permitAll()
                .anyRequest().authenticated())
        .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("numeroPoliza")
                .passwordParameter("password")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error")
                .permitAll())
        .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID"));

    return http.build();
}
    
}
