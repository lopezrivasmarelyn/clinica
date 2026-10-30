package sv.edu.esfe.segurodigital.presentation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;

@Controller
public class LoginController {

    private final SesionAfiliado sesionAfiliado;

    public LoginController(SesionAfiliado sesionAfiliado) {
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping("/")
    public String raiz() {
        return sesionAfiliado.estaAutenticado()
                ? "redirect:/dashboard"
                : "redirect:/login";
    }

    @GetMapping("/login")
    public String mostrarLogin(
            @RequestParam(required = false) String error,
            Model model) {

        if (sesionAfiliado.estaAutenticado()) {
            return "redirect:/dashboard";
        }

        if (error != null) {
            model.addAttribute(
                    "error",
                    "Número de póliza o contraseña incorrectos");
        }

        return "login";
    }
}
