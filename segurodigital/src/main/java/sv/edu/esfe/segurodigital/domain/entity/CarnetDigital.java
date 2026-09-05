package sv.edu.esfe.segurodigital.domain.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "carnets_digitales")
public class CarnetDigital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "afiliado_id", nullable = false, unique = true)
    private Afiliado afiliado;

    @Column(name = "numero_afiliacion", nullable = false, length = 30)
    private String numeroAfiliacion;

    @Column(name = "codigo_qr", length = 255)
    private String codigoQr;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    public CarnetDigital() { }

    public CarnetDigital(Afiliado afiliado, String numeroAfiliacion, String codigoQr,
                          LocalDate fechaInicio, LocalDate fechaFin) {
        this.afiliado = afiliado;
        this.numeroAfiliacion = numeroAfiliacion;
        this.codigoQr = codigoQr;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    /** Regla de negocio simple: el carnet solo es valido dentro de su rango de fechas. */
    public boolean esVigente() {
        LocalDate hoy = LocalDate.now();
        return !hoy.isBefore(fechaInicio) && !hoy.isAfter(fechaFin);
    }

    /** Dias que faltan para que venza (negativo si ya vencio). */
    public long diasParaVencer() {
        return LocalDate.now().until(fechaFin).getDays()
                + LocalDate.now().until(fechaFin).getMonths() * 30L
                + LocalDate.now().until(fechaFin).getYears() * 365L;
    }

    public Long getId() { return id; }
    public Afiliado getAfiliado() { return afiliado; }
    public void setAfiliado(Afiliado afiliado) { this.afiliado = afiliado; }
    public String getNumeroAfiliacion() { return numeroAfiliacion; }
    public void setNumeroAfiliacion(String numeroAfiliacion) { this.numeroAfiliacion = numeroAfiliacion; }
    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
}
