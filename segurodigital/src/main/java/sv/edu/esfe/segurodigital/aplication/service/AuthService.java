package sv.edu.esfe.segurodigital.aplication.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.repository.AfiliadoRepository;

@Service
public class AuthService {

    private final AfiliadoRepository afiliadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final String dummyHash;

    public AuthService(
            AfiliadoRepository afiliadoRepository,
            PasswordEncoder passwordEncoder) {

        this.afiliadoRepository = afiliadoRepository;
        this.passwordEncoder = passwordEncoder;
        this.dummyHash = passwordEncoder.encode(
                java.util.UUID.randomUUID().toString());
    }

    public Optional<Afiliado> autenticar(
            String numeroPoliza, String password) {

        if (numeroPoliza == null || numeroPoliza.isBlank()
                || password == null || password.isBlank()) {
            return Optional.empty();
        }

        Optional<Afiliado> afiliado =
                afiliadoRepository.findByNumeroPoliza(
                        numeroPoliza.trim());

        String hash = afiliado
                .map(Afiliado::getPassword)
                .orElse(dummyHash);

        boolean coincide = passwordEncoder.matches(password, hash);

        return coincide ? afiliado : Optional.empty();
    }
}
