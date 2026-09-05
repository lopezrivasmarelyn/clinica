package sv.edu.esfe.segurodigital.presentation.controller;

import sv.edu.esfe.segurodigital.aplication.service.AfiliadoService;
import sv.edu.esfe.segurodigital.aplication.service.SolicitudReembolsoService;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/** HU-14, HU-15: pantalla de "Reembolsos" (listar y solicitar). */
@Controller
@RequestMapping("/reembolsos")
public class ReembolsoController {

    private final SolicitudReembolsoService reembolsoService;
    private final AfiliadoService afiliadoService;
    private final SesionAfiliado sesionAfiliado;

    public ReembolsoController(SolicitudReembolsoService reembolsoService, AfiliadoService afiliadoService,
                                SesionAfiliado sesionAfiliado) {
        this.reembolsoService = reembolsoService;
        this.afiliadoService = afiliadoService;
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping
    public String listar(Model model) {
        if (!sesionAfiliado.estaAutenticado()) return "redirect:/login";
        model.addAttribute("afiliado", afiliadoService.buscarPorId(sesionAfiliado.getAfiliadoId()));
        model.addAttribute("solicitudes", reembolsoService.listarPorAfiliado(sesionAfiliado.getAfiliadoId()));
        return "reembolsos";
    }

    @PostMapping
    public String solicitar(@RequestParam BigDecimal monto, @RequestParam String descripcion) {
        if (!sesionAfiliado.estaAutenticado()) return "redirect:/login";
        Afiliado afiliado = afiliadoService.buscarPorId(sesionAfiliado.getAfiliadoId());
        reembolsoService.solicitar(afiliado, monto, descripcion);
        return "redirect:/reembolsos";
    }
}
