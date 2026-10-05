import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function ClinicProfileScreen() {
  const { user, logout, setMode } = useAppContext();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Deseas salir de la cuenta de clínica?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => logout() }
    ]);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Administración</Text>

        {user && (
            <View style={styles.infoCard}>
              <Text style={styles.label}>Administrador:</Text>
              <Text style={styles.value}>{user.nombre}</Text>

              <Text style={styles.label}>Correo de Contacto:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
        )}

        <View style={styles.switchContainer}>
          <Button
              title="Volver a Modo Paciente"
              color="#0056b3"
              onPress={() => setMode('patient')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cerrar Sesión" color="#d9534f" onPress={handleLogout} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 20, elevation: 2 },
  label: { fontSize: 12, color: '#888', marginTop: 10, textTransform: 'uppercase' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 2 },
  switchContainer: { marginBottom: 20 },
  buttonContainer: { marginTop: 10 }
});
