package sv.edu.esfe.segurodigital.presentation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Asegúrate de que estos imports coincidan con la ubicación de tus clases
import sv.edu.esfe.segurodigital.aplication.service.AuthService;
import sv.edu.esfe.segurodigital.domain.entity.Afiliado;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints para inicio de sesión y autenticación en la app móvil")
public class AuthApiController {

    private final AuthService authService;

    public AuthApiController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Validar credenciales", description = "Recibe el número de póliza y la contraseña desde la app móvil para dar acceso al usuario.")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String numeroPoliza = credenciales.get("numeroPoliza");
        String password = credenciales.get("password");

        // IMPORTANTE: Si tu servicio de autenticación se llama diferente o el método no es "autenticar",
        // tendrás que ajustar esta línea.
        Optional<Afiliado> afiliado = authService.autenticar(numeroPoliza, password);

        if (afiliado.isPresent()) {
            return ResponseEntity.ok(afiliado.get()); // Retorna los datos del usuario si es correcto
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas"); // Retorna error 401 si falla
        }
    }
}