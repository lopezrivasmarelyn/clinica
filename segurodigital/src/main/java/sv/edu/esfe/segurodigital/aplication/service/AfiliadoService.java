package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.repository.AfiliadoRepository;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AfiliadoService {

    private final AfiliadoRepository repository;
private final PasswordEncoder passwordEncoder;

public AfiliadoService(
        AfiliadoRepository repository,
        PasswordEncoder passwordEncoder) {

    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
}

    public Afiliado buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Afiliado no encontrado"));
    }

    public Afiliado guardar(Afiliado afiliado) {
        return repository.save(afiliado);
    }

    public Afiliado registrar(Afiliado afiliado) {
    if (afiliado.getId() != null) {
        throw new IllegalArgumentException(
                "El registro debe corresponder a un afiliado nuevo");
    }

    String password = afiliado.getPassword();

    if (password == null || password.isBlank()
            || password.getBytes(StandardCharsets.UTF_8).length > 72) {

        throw new IllegalArgumentException(
                "La contraseña es obligatoria y no debe superar 72 bytes");
    }

    afiliado.setPassword(passwordEncoder.encode(password));

    return repository.save(afiliado);
}
}
