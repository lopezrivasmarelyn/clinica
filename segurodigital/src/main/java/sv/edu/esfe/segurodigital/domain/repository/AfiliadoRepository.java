package sv.edu.esfe.segurodigital.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;

import java.util.Optional;

public interface AfiliadoRepository extends JpaRepository<Afiliado, Long> {
    Optional<Afiliado> findByEmail(String email);
    Optional<Afiliado> findByNumeroPoliza(String numeroPoliza);
}
