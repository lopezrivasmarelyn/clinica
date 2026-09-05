package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.repository.AfiliadoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/** HU-01: valida las credenciales de inicio de sesion del afiliado. */
@Service
public class AuthService {

    private final AfiliadoRepository afiliadoRepository;

    public AuthService(AfiliadoRepository afiliadoRepository) {
        this.afiliadoRepository = afiliadoRepository;
    }

    public Optional<Afiliado> autenticar(String numeroPoliza, String password) {
        return afiliadoRepository.findByNumeroPoliza(numeroPoliza)
                .filter(a -> a.getPassword().equals(password));
    }
}
