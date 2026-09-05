package sv.edu.esfe.segurodigital.domain.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_reembolso")
public class SolicitudReembolso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "afiliado_id", nullable = false)
    private Afiliado afiliado;

    @ManyToOne
    @JoinColumn(name = "cita_id")
    private Cita cita;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false, length = 20)
    private String estado; // EN_REVISION, APROBADO, RECHAZADO

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    public SolicitudReembolso() { }

    public SolicitudReembolso(Afiliado afiliado, Cita cita, BigDecimal monto, String descripcion) {
        this.afiliado = afiliado;
        this.cita = cita;
        this.monto = monto;
        this.descripcion = descripcion;
        this.estado = "EN_REVISION";
        this.fechaSolicitud = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Afiliado getAfiliado() { return afiliado; }
    public void setAfiliado(Afiliado afiliado) { this.afiliado = afiliado; }
    public Cita getCita() { return cita; }
    public void setCita(Cita cita) { this.cita = cita; }
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
}
