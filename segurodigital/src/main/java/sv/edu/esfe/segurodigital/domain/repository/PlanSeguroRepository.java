package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.PlanSeguro;

public interface PlanSeguroRepository extends JpaRepository<PlanSeguro, Long> {
}
