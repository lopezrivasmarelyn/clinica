import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { ApiService, CentroMedico } from '../../services/api';

export default function HomeScreen() {
  const [centros, setCentros] = useState<CentroMedico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Petición al endpoint GET /api/centros-medicos
  const cargarCentros = async () => {
    try {
      const data = await ApiService.getCentrosMedicos();
      setCentros(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los centros médicos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCentros();
  }, []);

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando centros médicos...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Centros Médicos Disponibles</Text>

        {centros.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No hay centros médicos activos registrados.</Text>
            </View>
        ) : (
            <FlatList
                data={centros}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => { setRefreshing(true); cargarCentros(); }}
                  />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={styles.nombre}>{item.nombre}</Text>
                      <Text style={styles.direccion}>📍 {item.direccion}</Text>
                      <Text style={styles.telefono}>📞 {item.telefono}</Text>
                    </View>
                )}
            />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
  },
  direccion: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  telefono: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
});