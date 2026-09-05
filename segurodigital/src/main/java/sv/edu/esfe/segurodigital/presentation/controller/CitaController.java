package sv.edu.esfe.segurodigital.presentation.controller;

import sv.edu.esfe.segurodigital.aplication.service.AfiliadoService;
import sv.edu.esfe.segurodigital.aplication.service.CentroMedicoService;
import sv.edu.esfe.segurodigital.aplication.service.CitaService;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.entity.CentroMedico;
import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/** HU-04, HU-06, HU-07: pantalla de "Mis citas" (listar, agendar, cancelar). */
@Controller
@RequestMapping("/citas")
public class CitaController {

    private final CitaService citaService;
    private final AfiliadoService afiliadoService;
    private final CentroMedicoService centroMedicoService;
    private final SesionAfiliado sesionAfiliado;

    public CitaController(CitaService citaService, AfiliadoService afiliadoService,
                           CentroMedicoService centroMedicoService, SesionAfiliado sesionAfiliado) {
        this.citaService = citaService;
        this.afiliadoService = afiliadoService;
        this.centroMedicoService = centroMedicoService;
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping
    public String listar(Model model) {
        if (!sesionAfiliado.estaAutenticado()) return "redirect:/login";
        model.addAttribute("afiliado", afiliadoService.buscarPorId(sesionAfiliado.getAfiliadoId()));
        model.addAttribute("citas", citaService.listarPorAfiliado(sesionAfiliado.getAfiliadoId()));
        model.addAttribute("centros", centroMedicoService.listarActivos());
        return "citas";
    }

    @PostMapping
    public String agendar(@RequestParam Long centroMedicoId,
                           @RequestParam String especialidad,
                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHora,
                           Model model) {
        if (!sesionAfiliado.estaAutenticado()) return "redirect:/login";
        Afiliado afiliado = afiliadoService.buscarPorId(sesionAfiliado.getAfiliadoId());
        CentroMedico centro = centroMedicoService.buscarPorId(centroMedicoId);
        try {
            citaService.agendar(afiliado, centro, especialidad, fechaHora);
        } catch (IllegalStateException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("citas", citaService.listarPorAfiliado(afiliado.getId()));
            model.addAttribute("centros", centroMedicoService.listarActivos());
            return "citas";
        }
        return "redirect:/citas";
    }

    @PostMapping("/{id}/cancelar")
    public String cancelar(@PathVariable Long id) {
        citaService.cancelar(id);
        return "redirect:/citas";
    }
}
