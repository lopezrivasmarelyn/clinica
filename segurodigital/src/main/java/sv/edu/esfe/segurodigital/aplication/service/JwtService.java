package sv.edu.esfe.segurodigital.aplication.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final String issuer;
    private final long expirationSeconds;

    public JwtService(
            JwtEncoder encoder,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {

        if (expirationSeconds <= 0) {
            throw new IllegalArgumentException(
                    "La duración del token debe ser mayor que cero");
        }

        this.encoder = encoder;
        this.issuer = issuer;
        this.expirationSeconds = expirationSeconds;
    }

    public String generarToken(Afiliado afiliado) {
        Instant ahora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .subject(afiliado.getId().toString())
                .issuedAt(ahora)
                .expiresAt(ahora.plusSeconds(expirationSeconds))
                .build();

        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return encoder.encode(
                JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }
}
