package sv.edu.esfe.segurodigital.presentation.controller;

import java.util.Map;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import sv.edu.esfe.segurodigital.aplication.service.AuthService;
import sv.edu.esfe.segurodigital.aplication.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación")
public class AuthApiController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthApiController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    public record LoginRequest(
            String numeroPoliza,
            String password) {
    }

    public record AfiliadoResumen(
            Long id,
            String nombre) {
    }

    public record LoginResponse(
            String access_token,
            String token_type,
            long expires_in,
            AfiliadoResumen afiliado) {
    }

    @Operation(summary = "Iniciar sesión y obtener un Bearer Token")
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest credenciales) {

        if (credenciales.numeroPoliza() == null
                || credenciales.numeroPoliza().isBlank()
                || credenciales.password() == null
                || credenciales.password().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of("mensaje",
                            "Número de póliza y contraseña son obligatorios"));
        }

        var resultado = authService.autenticar(
                credenciales.numeroPoliza(),
                credenciales.password());

        if (resultado.isEmpty()) {
            return ResponseEntity.status(401).body(
                    Map.of("mensaje", "Credenciales inválidas"));
        }

        var afiliado = resultado.get();

        LoginResponse respuesta = new LoginResponse(
                jwtService.generarToken(afiliado),
                "Bearer",
                jwtService.getExpirationSeconds(),
                new AfiliadoResumen(
                        afiliado.getId(),
                        afiliado.getNombre()));

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(respuesta);
    }
}
