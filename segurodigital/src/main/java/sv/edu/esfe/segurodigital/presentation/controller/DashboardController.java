package sv.edu.esfe.segurodigital.presentation.controller;

import sv.edu.esfe.segurodigital.aplication.service.*;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.domain.entity.CarnetDigital;
import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

/** HU-02, HU-04, HU-05, HU-09, HU-12: panel principal del afiliado. */
@Controller
public class DashboardController {

    private final AfiliadoService afiliadoService;
    private final CarnetDigitalService carnetDigitalService;
    private final CitaService citaService;
    private final CentroMedicoService centroMedicoService;
    private final SesionAfiliado sesionAfiliado;

    public DashboardController(AfiliadoService afiliadoService, CarnetDigitalService carnetDigitalService,
                                CitaService citaService, CentroMedicoService centroMedicoService,
                                SesionAfiliado sesionAfiliado) {
        this.afiliadoService = afiliadoService;
        this.carnetDigitalService = carnetDigitalService;
        this.citaService = citaService;
        this.centroMedicoService = centroMedicoService;
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping("/dashboard")
    public String panel(Model model) {
        if (!sesionAfiliado.estaAutenticado()) {
            return "redirect:/login";
        }
        Long afiliadoId = sesionAfiliado.getAfiliadoId();
        Afiliado afiliado = afiliadoService.buscarPorId(afiliadoId);
        CarnetDigital carnet = carnetDigitalService.buscarPorAfiliado(afiliadoId);
        List<sv.edu.esfe.segurodigital.domain.entity.Cita> citas = citaService.listarPorAfiliado(afiliadoId);

        model.addAttribute("afiliado", afiliado);
        model.addAttribute("carnet", carnet);
        model.addAttribute("carnetPorVencer", carnetDigitalService.estaPorVencer(carnet));
        model.addAttribute("citas", citas);
        model.addAttribute("centros", centroMedicoService.listarActivos());
        return "dashboard";
    }
}
