package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.CentroMedico;

import java.util.List;

public interface CentroMedicoRepository extends JpaRepository<CentroMedico, Long> {
    List<CentroMedico> findByActivoTrue();
}
