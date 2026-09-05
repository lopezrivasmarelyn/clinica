package sv.edu.esfe.segurodigital.domain.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "citas")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "afiliado_id", nullable = false)
    private Afiliado afiliado;

    @ManyToOne
    @JoinColumn(name = "centro_medico_id", nullable = false)
    private CentroMedico centroMedico;

    @Column(nullable = false, length = 80)
    private String especialidad;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(nullable = false, length = 20)
    private String estado; // PENDIENTE, CONFIRMADA, CANCELADA, ATENDIDA

    public Cita() { }

    public Cita(Afiliado afiliado, CentroMedico centroMedico, String especialidad, LocalDateTime fechaHora) {
        this.afiliado = afiliado;
        this.centroMedico = centroMedico;
        this.especialidad = especialidad;
        this.fechaHora = fechaHora;
        this.estado = "PENDIENTE";
    }

    public Long getId() { return id; }
    public Afiliado getAfiliado() { return afiliado; }
    public void setAfiliado(Afiliado afiliado) { this.afiliado = afiliado; }
    public CentroMedico getCentroMedico() { return centroMedico; }
    public void setCentroMedico(CentroMedico centroMedico) { this.centroMedico = centroMedico; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
