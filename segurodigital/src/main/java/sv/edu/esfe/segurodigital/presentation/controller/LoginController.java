package sv.edu.esfe.segurodigital.presentation.controller;

import sv.edu.esfe.segurodigital.aplication.service.AuthService;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;
import sv.edu.esfe.segurodigital.infrastructure.config.SesionAfiliado;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
public class LoginController {

    private final AuthService authService;
    private final SesionAfiliado sesionAfiliado;

    public LoginController(AuthService authService, SesionAfiliado sesionAfiliado) {
        this.authService = authService;
        this.sesionAfiliado = sesionAfiliado;
    }

    @GetMapping("/")
    public String raiz() {
        return sesionAfiliado.estaAutenticado() ? "redirect:/dashboard" : "redirect:/login";
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";
    }

    @PostMapping("/login")
    public String iniciarSesion(@RequestParam String numeroPoliza,
                                 @RequestParam String password,
                                 Model model) {
        Optional<Afiliado> afiliado = authService.autenticar(numeroPoliza, password);
        if (afiliado.isEmpty()) {
            model.addAttribute("error", "Número de póliza o contraseña incorrectos");
            return "login";
        }
        sesionAfiliado.setAfiliadoId(afiliado.get().getId());
        return "redirect:/dashboard";
    }

    @GetMapping("/logout")
    public String cerrarSesion() {
        sesionAfiliado.setAfiliadoId(null);
        return "redirect:/login";
    }
}
