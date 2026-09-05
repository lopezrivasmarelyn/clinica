package sv.edu.esfe.segurodigital.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "centros_medicos")
public class CentroMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 200)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    private double latitud;
    private double longitud;

    @Column(nullable = false)
    private boolean activo = true;

    public CentroMedico() { }

    public CentroMedico(String nombre, String direccion, String telefono, double latitud, double longitud) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.latitud = latitud;
        this.longitud = longitud;
        this.activo = true;
    }

    /** Distancia aproximada en kilometros (formula de Haversine), para HU-09. */
    public double distanciaKm(double lat, double lng) {
        final double RADIO_TIERRA_KM = 6371.0;
        double dLat = Math.toRadians(lat - this.latitud);
        double dLon = Math.toRadians(lng - this.longitud);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(this.latitud)) * Math.cos(Math.toRadians(lat))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIO_TIERRA_KM * c;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public double getLatitud() { return latitud; }
    public void setLatitud(double latitud) { this.latitud = latitud; }
    public double getLongitud() { return longitud; }
    public void setLongitud(double longitud) { this.longitud = longitud; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
