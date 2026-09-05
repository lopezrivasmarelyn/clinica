package sv.edu.esfe.segurodigital.infrastructure.config;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

/**
 * Guarda el id del afiliado que inicio sesion (sustituto simple de Spring
 * Security para esta version del proyecto). Un bean @SessionScope vive
 * mientras dura la sesion HTTP del navegador.
 */
@Component
@SessionScope
public class SesionAfiliado {

    private Long afiliadoId;

    public Long getAfiliadoId() { return afiliadoId; }
    public void setAfiliadoId(Long afiliadoId) { this.afiliadoId = afiliadoId; }
    public boolean estaAutenticado() { return afiliadoId != null; }
}
