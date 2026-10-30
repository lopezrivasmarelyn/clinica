package sv.edu.esfe.segurodigital;

import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarHash {

    public static void main(String[] args) {
        System.out.println(
                "Introduce una contraseña NUEVA de prueba "
                + "(será visible en esta consola):");

        Scanner scanner = new Scanner(System.in);
        String password = scanner.nextLine();

        if (password.isBlank()
                || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException(
                    "Contraseña vacía o superior a 72 bytes");
        }

        System.out.println(new BCryptPasswordEncoder().encode(password));
    }
}
