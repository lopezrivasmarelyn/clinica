package sv.edu.esfe.segurodigital.presentation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.edu.esfe.segurodigital.aplication.service.CitaService;
import sv.edu.esfe.segurodigital.domain.entity.Cita;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@Tag(name = "Citas Médicas", description = "Endpoints para la gestión de citas en la aplicación móvil")
public class CitaApiController {

    private final CitaService citaService;

    public CitaApiController(CitaService citaService) {
        this.citaService = citaService;
    }

    @Operation(summary = "Obtener citas de un afiliado", description = "Devuelve todas las citas asociadas al ID de un afiliado.")
    @GetMapping("/afiliado/{id}")
    public ResponseEntity<List<Cita>> obtenerCitasPorAfiliado(@PathVariable Long id) {
        List<Cita> citas = citaService.listarPorAfiliado(id);
        return ResponseEntity.ok(citas);
    }

    @Operation(summary = "Agendar nueva cita", description = "Recibe los datos de la cita desde la app móvil y valida la disponibilidad de horario.")
    @PostMapping
    public ResponseEntity<?> agendarCita(@RequestBody Cita cita) {
        try {
            Cita nuevaCita = citaService.agendar(
                    cita.getAfiliado(),
                    cita.getCentroMedico(),
                    cita.getEspecialidad(),
                    cita.getFechaHora()
            );
            return ResponseEntity.ok(nuevaCita);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Cancelar una cita", description = "Cambia el estado de una cita a CANCELADA por su ID.")
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarCita(@PathVariable Long id) {
        try {
            Cita citaCancelada = citaService.cancelar(id);
            return ResponseEntity.ok(citaCancelada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}