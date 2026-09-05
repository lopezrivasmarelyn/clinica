-- =====================================================================
-- Datos de ejemplo para Seguro Digital.
-- Con spring.jpa.hibernate.ddl-auto=update, Hibernate crea las tablas
-- pero NO inserta datos. Corre este script en MySQL Workbench (o tu
-- cliente de MySQL) despues de levantar la aplicacion una vez, para que
-- Hibernate ya haya creado las tablas.
-- =====================================================================

USE segurodigital_db;

INSERT INTO planes_seguro (id, nombre, descripcion) VALUES
  (1, 'Plan Familiar Plus', 'Cobertura amplia para el afiliado y su nucleo familiar, incluye consulta general, laboratorio y emergencias.');

-- La contrasena aqui esta en texto plano solo para fines de demo academica.
-- numeroPoliza es el usuario para iniciar sesion en /login.
INSERT INTO afiliados (id, nombre, email, password, numero_poliza, telefono, plan_id) VALUES
  (1, 'Maria Ramirez', 'maria.ramirez@correo.com', '12345678', '04812-2024-A', '7000-1234', 1);

INSERT INTO carnets_digitales (id, afiliado_id, numero_afiliacion, codigo_qr, fecha_inicio, fecha_fin) VALUES
  (1, 1, '04812 2024 A', 'QR-04812-2024-A', '2026-01-01', '2026-09-18');

INSERT INTO centros_medicos (id, nombre, direccion, telefono, latitud, longitud, activo) VALUES
  (1, 'Clinica San Rafael', '3a Calle Poniente, Santa Ana', '2440-1111', 13.9942, -89.5597, true),
  (2, 'Laboratorio Central', 'Av. Independencia Sur, Santa Ana', '2440-2222', 13.9890, -89.5550, true);

INSERT INTO citas (id, afiliado_id, centro_medico_id, especialidad, fecha_hora, estado) VALUES
  (1, 1, 1, 'Chequeo general - Revision anual', '2026-09-09 09:00:00', 'CONFIRMADA'),
  (2, 1, 2, 'Examenes de rutina', '2026-09-15 14:30:00', 'PENDIENTE');

INSERT INTO solicitudes_reembolso (id, afiliado_id, cita_id, monto, descripcion, estado, fecha_solicitud) VALUES
  (1, 1, 1, 25.00, 'Consulta general - Clinica San Rafael', 'EN_REVISION', '2026-09-03 10:00:00');
