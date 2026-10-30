package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.entity.CentroMedico;
import sv.edu.esfe.segurodigital.domain.entity.Cita;
import sv.edu.esfe.segurodigital.domain.repository.CitaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;

/** HU-04 a HU-07: historial, agendar, reprogramar y cancelar citas. */
@Service
public class CitaService {

    private final CitaRepository repository;
private final SesionAfiliado sesionAfiliado;

public CitaService(
        CitaRepository repository,
        SesionAfiliado sesionAfiliado) {

    this.repository = repository;
    this.sesionAfiliado = sesionAfiliado;
}

    public List<Cita> listarPorAfiliado(Long afiliadoId) {
    verificarPropietario(afiliadoId);
    return repository.findByAfiliadoIdOrderByFechaHoraAsc(
            afiliadoId);
}

    /**
     * HU-06: agenda una cita, validando que no haya otra cita activa en el mismo
     * centro medico dentro de una ventana de 30 minutos.
     */
    public Cita agendar(Afiliado afiliado, CentroMedico centroMedico, String especialidad, LocalDateTime fechaHora) {
        verificarPropietario(
        afiliado == null ? null : afiliado.getId());
        boolean hayConflicto = repository.findByCentroMedicoId(centroMedico.getId()).stream()
                .filter(c -> !"CANCELADA".equals(c.getEstado()))
                .anyMatch(c -> Math.abs(java.time.Duration.between(c.getFechaHora(), fechaHora).toMinutes()) < 30);

        if (hayConflicto) {
            throw new IllegalStateException("Ya existe una cita agendada en ese horario para este centro medico");
        }

        Cita cita = new Cita(afiliado, centroMedico, especialidad, fechaHora);
        return repository.save(cita);
    }

    @Transactional
public Cita cancelar(Long citaId) {
    Cita cita = repository.findById(citaId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Cita no encontrada"));

    verificarPropietario(cita.getAfiliado().getId());

    cita.setEstado("CANCELADA");
    return repository.save(cita);
}

    @Transactional
    public Cita reprogramar(Long citaId, LocalDateTime nuevaFechaHora) {
        Cita cita = repository.findById(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        verificarPropietario(cita.getAfiliado().getId());
        cita.setFechaHora(nuevaFechaHora);
        return repository.save(cita);
    }

    private void verificarPropietario(Long afiliadoId) {
    Long actual = sesionAfiliado.getAfiliadoId();

    if (actual == null || !Objects.equals(actual, afiliadoId)) {
        throw new AccessDeniedException(
                "No tienes permiso para acceder a estas citas");
    }
}
}
