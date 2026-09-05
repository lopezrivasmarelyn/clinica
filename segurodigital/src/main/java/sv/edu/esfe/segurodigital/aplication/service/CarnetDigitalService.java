package sv.edu.esfe.segurodigital.aplication.service;

import sv.edu.esfe.segurodigital.domain.entity.CarnetDigital;
import sv.edu.esfe.segurodigital.domain.repository.CarnetDigitalRepository;
import org.springframework.stereotype.Service;

/** HU-02, HU-12: consultar el carnet digital y su vigencia. */
@Service
public class CarnetDigitalService {

    private static final int DIAS_ALERTA_VENCIMIENTO = 15;

    private final CarnetDigitalRepository repository;

    public CarnetDigitalService(CarnetDigitalRepository repository) {
        this.repository = repository;
    }

    public CarnetDigital buscarPorAfiliado(Long afiliadoId) {
        return repository.findByAfiliadoId(afiliadoId).orElse(null);
    }

    public boolean estaPorVencer(CarnetDigital carnet) {
        if (carnet == null) return false;
        long dias = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), carnet.getFechaFin());
        return dias >= 0 && dias <= DIAS_ALERTA_VENCIMIENTO;
    }
}
