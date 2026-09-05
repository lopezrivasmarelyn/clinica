package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.entity.SolicitudReembolso;
import sv.edu.esfe.segurodigital.domain.repository.SolicitudReembolsoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/** HU-14, HU-15: solicitar e historial de reembolsos. */
@Service
public class SolicitudReembolsoService {

    private final SolicitudReembolsoRepository repository;

    public SolicitudReembolsoService(SolicitudReembolsoRepository repository) {
        this.repository = repository;
    }

    public List<SolicitudReembolso> listarPorAfiliado(Long afiliadoId) {
        return repository.findByAfiliadoIdOrderByFechaSolicitudDesc(afiliadoId);
    }

    public SolicitudReembolso solicitar(Afiliado afiliado, BigDecimal monto, String descripcion) {
        SolicitudReembolso solicitud = new SolicitudReembolso(afiliado, null, monto, descripcion);
        return repository.save(solicitud);
    }
}
