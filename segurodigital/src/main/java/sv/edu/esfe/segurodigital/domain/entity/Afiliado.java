package sv.edu.esfe.segurodigital.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "afiliados")
public class Afiliado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 120)
    private String password;

    @Column(name = "numero_poliza", nullable = false, length = 30)
    private String numeroPoliza;

    @Column(length = 20)
    private String telefono;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private PlanSeguro plan;

    public Afiliado() { }

    public Afiliado(String nombre, String email, String password, String numeroPoliza, String telefono, PlanSeguro plan) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.numeroPoliza = numeroPoliza;
        this.telefono = telefono;
        this.plan = plan;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNumeroPoliza() { return numeroPoliza; }
    public void setNumeroPoliza(String numeroPoliza) { this.numeroPoliza = numeroPoliza; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public PlanSeguro getPlan() { return plan; }
    public void setPlan(PlanSeguro plan) { this.plan = plan; }
}
