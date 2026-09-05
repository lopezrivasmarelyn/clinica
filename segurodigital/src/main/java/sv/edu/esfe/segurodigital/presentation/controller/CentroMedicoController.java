package sv.edu.esfe.segurodigital.presentation.controller;

import sv.edu.esfe.segurodigital.aplication.service.AfiliadoService;
import sv.edu.esfe.segurodigital.aplication.service.CentroMedicoService;
import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/** HU-09, HU-10: pantalla de "Centros médicos". */
@Controller
public class CentroMedicoController {

    private final CentroMedicoService centroMedicoService;
    private final AfiliadoService afiliadoService;
    private final SesionAfiliado sesionAfiliado;

    public CentroMedicoController(CentroMedicoService centroMedicoService, AfiliadoService afiliadoService,
                                   SesionAfiliado sesionAfiliado) {
        this.centroMedicoService = centroMedicoService;
        this.afiliadoService = afiliadoService;
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping("/centros")
    public String listar(@RequestParam(required = false) Double lat,
                          @RequestParam(required = false) Double lng,
                          Model model) {
        if (!sesionAfiliado.estaAutenticado()) return "redirect:/login";
        model.addAttribute("afiliado", afiliadoService.buscarPorId(sesionAfiliado.getAfiliadoId()));
        model.addAttribute("lat", lat);
        model.addAttribute("lng", lng);
        if (lat != null && lng != null) {
            model.addAttribute("centros", centroMedicoService.buscarCercanos(lat, lng));
        } else {
            model.addAttribute("centros", centroMedicoService.listarActivos());
        }
        return "centros";
    }
}
