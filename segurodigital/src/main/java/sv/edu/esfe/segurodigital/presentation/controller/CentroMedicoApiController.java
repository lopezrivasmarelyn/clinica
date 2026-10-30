package sv.edu.esfe.segurodigital.presentation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sv.edu.esfe.segurodigital.aplication.service.CentroMedicoService;
import sv.edu.esfe.segurodigital.domain.entity.CentroMedico;

import java.util.List;

@RestController
@RequestMapping("/api/centros-medicos")
@Tag(name = "Centros Médicos", description = "Endpoints para la aplicación móvil sobre sucursales y clínicas")
public class CentroMedicoApiController {

    private final CentroMedicoService centroMedicoService;

    // Inyección de dependencias a través del constructor
    public CentroMedicoApiController(CentroMedicoService centroMedicoService) {
        this.centroMedicoService = centroMedicoService;
    }

    @Operation(summary = "Obtener todos los centros médicos activos", description = "Devuelve una lista en formato JSON con la información de los centros médicos para mostrarlos en el mapa de la app.")
    @GetMapping
    public List<CentroMedico> listarCentros() {
        return centroMedicoService.listarActivos();
    }
}