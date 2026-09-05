package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.Cita;

import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByAfiliadoIdOrderByFechaHoraAsc(Long afiliadoId);
    List<Cita> findByCentroMedicoId(Long centroMedicoId);
}
