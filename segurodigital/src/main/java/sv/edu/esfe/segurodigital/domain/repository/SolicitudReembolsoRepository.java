package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.SolicitudReembolso;

import java.util.List;

public interface SolicitudReembolsoRepository extends JpaRepository<SolicitudReembolso, Long> {
    List<SolicitudReembolso> findByAfiliadoIdOrderByFechaSolicitudDesc(Long afiliadoId);
}
