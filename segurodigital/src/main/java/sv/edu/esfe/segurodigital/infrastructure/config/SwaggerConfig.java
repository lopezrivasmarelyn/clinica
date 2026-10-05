package sv.edu.esfe.segurodigital.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Seguro Digital")
                        .version("1.0.0")
                        .description("Documentación oficial de los endpoints RESTful para la aplicación móvil.")
                        .contact(new Contact()
                                .name("Tu Nombre/Equipo")
                                .email("soporte@segurodigital.com")));
    }
}