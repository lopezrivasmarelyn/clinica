package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.repository.AfiliadoRepository;
import org.springframework.stereotype.Service;

@Service
public class AfiliadoService {

    private final AfiliadoRepository repository;

    public AfiliadoService(AfiliadoRepository repository) {
        this.repository = repository;
    }

    public Afiliado buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Afiliado no encontrado"));
    }

    public Afiliado guardar(Afiliado afiliado) {
        return repository.save(afiliado);
    }
}
