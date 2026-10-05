import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { ApiService, Cita, CentroMedico } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AppointmentsScreen() {
  const { user } = useAppContext();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [centros, setCentros] = useState<CentroMedico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Estados para el Modal de Nueva Cita
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<number | null>(null);
  const [especialidad, setEspecialidad] = useState('');
  const [fechaHora, setFechaHora] = useState('2026-10-15T09:00:00'); // Formato ISO por defecto
  const [creando, setCreando] = useState(false);

  const cargarCitas = async () => {
    if (!user) return;
    try {
      const data = await ApiService.getCitasPorAfiliado(user.id);
      setCitas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar tus citas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cargarCentros = async () => {
    try {
      const data = await ApiService.getCentrosMedicos();
      setCentros(data);
    } catch (error) {
      console.log('Error al cargar centros para el modal');
    }
  };

  useEffect(() => {
    cargarCitas();
    cargarCentros(); // Cargamos las clínicas para que el usuario pueda elegir
  }, [user]);

  const handleCancelar = (citaId?: number) => {
    if (!citaId) return;
    Alert.alert('Cancelar Cita', '¿Estás seguro?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiService.cancelarCita(citaId);
            Alert.alert('Éxito', 'Cita cancelada.');
            cargarCitas();
          } catch (error) {
            Alert.alert('Error', 'No se pudo cancelar.');
          }
        }
      }
    ]);
  };

  // Función para enviar la nueva cita a Spring Boot
  const handleAgendarCita = async () => {
    if (!selectedCentro || !especialidad || !fechaHora) {
      Alert.alert('Atención', 'Por favor completa todos los campos.');
      return;
    }

    if (!user) return;

    setCreando(true);
    try {
      const nuevaCita: Cita = {
        afiliado: { id: user.id },
        centroMedico: { id: selectedCentro },
        especialidad: especialidad,
        fechaHora: fechaHora,
      };

      await ApiService.agendarCita(nuevaCita);
      Alert.alert('¡Éxito!', 'Tu cita ha sido agendada.');
      setModalVisible(false);

      // Limpiamos el formulario y recargamos la lista
      setEspecialidad('');
      setSelectedCentro(null);
      cargarCitas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agendar la cita. Verifica los datos.');
    } finally {
      setCreando(false);
    }
  };

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0056b3" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mis Citas</Text>
          <Button title="+ Nueva" onPress={() => setModalVisible(true)} />
        </View>

        {/* Modal para agendar nueva cita */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Agendar Nueva Cita</Text>

              <Text style={styles.label}>ID de la Clínica (Ej: 1 o 2):</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Escribe el ID del centro"
                  keyboardType="numeric"
                  onChangeText={(text) => setSelectedCentro(Number(text))}
              />

              <Text style={styles.label}>Especialidad:</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Ej: Odontología, Medicina General"
                  value={especialidad}
                  onChangeText={setEspecialidad}
              />

              <Text style={styles.label}>Fecha y Hora (YYYY-MM-DDTHH:mm:ss):</Text>
              <TextInput
                  style={styles.input}
                  value={fechaHora}
                  onChangeText={setFechaHora}
              />

              {creando ? (
                  <ActivityIndicator size="large" color="#0056b3" />
              ) : (
                  <View style={styles.modalButtons}>
                    <Button title="Cancelar" color="#888" onPress={() => setModalVisible(false)} />
                    <Button title="Agendar" onPress={handleAgendarCita} />
                  </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Lista de citas (lo que ya tenías) */}
        {citas.length === 0 ? (
            <View style={styles.center}><Text>No tienes citas.</Text></View>
        ) : (
            <FlatList
                data={citas}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargarCitas(); }} />}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.especialidad}>{item.especialidad}</Text>
                      <Text style={styles.fecha}>Fecha: {new Date(item.fechaHora).toLocaleString()}</Text>
                      <Text style={[styles.estado, { color: item.estado === 'CANCELADA' ? '#d9534f' : '#28a745' }]}>
                        Estado: {item.estado || 'PENDIENTE'}
                      </Text>
                      {item.estado !== 'CANCELADA' && (
                          <View style={styles.buttonContainer}>
                            <Button title="Cancelar Cita" color="#d9534f" onPress={() => handleCancelar(item.id)} />
                          </View>
                      )}
                    </View>
                )}
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  especialidad: { fontSize: 18, fontWeight: 'bold', color: '#0056b3' },
  fecha: { fontSize: 14, color: '#555', marginTop: 5 },
  estado: { fontSize: 14, fontWeight: '600', marginTop: 5 },
  buttonContainer: { marginTop: 10 },

  // Estilos del Modal
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 14, color: '#333', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }
});