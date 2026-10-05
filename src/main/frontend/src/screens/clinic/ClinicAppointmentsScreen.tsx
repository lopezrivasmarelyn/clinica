import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  RefreshControl
} from 'react-native';
import { ApiService, Cita } from '../../services/api';

export default function ClinicAppointmentsScreen() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Por ahora consultamos las citas del centro médico con ID 1
  const CENTRO_ID = 1;

  const cargarCitasCentro = async () => {
    try {
      // Usamos el endpoint para traer citas por afiliado/centro
      const data = await ApiService.getCitasPorAfiliado(CENTRO_ID);
      setCitas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas de la clínica.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCitasCentro();
  }, []);

  const handleCancelar = (citaId?: number) => {
    if (!citaId) return;

    Alert.alert('Cancelar Cita', '¿Deseas cancelar esta cita médica?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, Cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await ApiService.cancelarCita(citaId);
            Alert.alert('Éxito', 'Cita cancelada.');
            cargarCitasCentro();
          } catch (error) {
            Alert.alert('Error', 'No se pudo cancelar la cita.');
          }
        }
      }
    ]);
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
        <Text style={styles.title}>Panel de Citas de la Clínica</Text>

        {citas.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No hay citas programadas para esta clínica.</Text>
            </View>
        ) : (
            <FlatList
                data={citas}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => { setRefreshing(true); cargarCitasCentro(); }}
                  />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.especialidad}>{item.especialidad}</Text>
                      <Text style={styles.info}>Afiliado ID: {item.afiliado?.id}</Text>
                      <Text style={styles.fecha}>
                        Fecha: {new Date(item.fechaHora).toLocaleString()}
                      </Text>
                      <Text style={[
                        styles.estado,
                        { color: item.estado === 'CANCELADA' ? '#d9534f' : '#28a745' }
                      ]}>
                        Estado: {item.estado || 'PENDIENTE'}
                      </Text>

                      {item.estado !== 'CANCELADA' && (
                          <View style={styles.buttonContainer}>
                            <Button
                                title="Cancelar Cita"
                                color="#d9534f"
                                onPress={() => handleCancelar(item.id)}
                            />
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  emptyText: { fontSize: 16, color: '#888' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  especialidad: { fontSize: 18, fontWeight: 'bold', color: '#0056b3' },
  info: { fontSize: 14, color: '#444', marginTop: 4 },
  fecha: { fontSize: 14, color: '#555', marginTop: 4 },
  estado: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  buttonContainer: { marginTop: 10 },
});