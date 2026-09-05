package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.CentroMedico;
import sv.edu.esfe.segurodigital.domain.repository.CentroMedicoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/** HU-09, HU-10: listar centros medicos y ordenarlos por cercania. */
@Service
public class CentroMedicoService {

    private final CentroMedicoRepository repository;

    public CentroMedicoService(CentroMedicoRepository repository) {
        this.repository = repository;
    }

    public List<CentroMedico> listarActivos() {
        return repository.findByActivoTrue();
    }

    /** Ordena los centros activos por distancia a un punto (lat/lng), el mas cercano primero. */
    public List<CentroMedico> buscarCercanos(double latitud, double longitud) {
        return repository.findByActivoTrue().stream()
                .sorted(Comparator.comparingDouble(c -> c.distanciaKm(latitud, longitud)))
                .collect(Collectors.toList());
    }

    public CentroMedico buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Centro medico no encontrado"));
    }
}
