import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { ApiService, CentroMedico } from '../../services/api';

export default function ClinicScheduleScreen() {
  const [centros, setCentros] = useState<CentroMedico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDetalles = async () => {
    try {
      const data = await ApiService.getCentrosMedicos();
      setCentros(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de las sedes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDetalles();
  }, []);

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0056b3" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Sedes y Disponibilidad</Text>

        <FlatList
            data={centros}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargarDetalles(); }} />
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text style={styles.detalle}>📍 Dirección: {item.direccion}</Text>
                  <Text style={styles.detalle}>📞 Teléfono: {item.telefono}</Text>
                  <Text style={[styles.estado, { color: item.activo ? '#28a745' : '#d9534f' }]}>
                    {item.activo ? '● Centro Activo / Operativo' : '○ Centro Inactivo'}
                  </Text>
                </View>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#0056b3' },
  detalle: { fontSize: 14, color: '#555', marginTop: 4 },
  estado: { fontSize: 14, fontWeight: '600', marginTop: 8 },
});