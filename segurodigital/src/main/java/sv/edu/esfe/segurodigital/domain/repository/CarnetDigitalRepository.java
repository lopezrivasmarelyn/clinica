package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.CarnetDigital;

import java.util.Optional;

public interface CarnetDigitalRepository extends JpaRepository<CarnetDigital, Long> {
    Optional<CarnetDigital> findByAfiliadoId(Long afiliadoId);
}
