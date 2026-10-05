import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function ProfileScreen() {
  const { user, logout, mode, setMode } = useAppContext();

  const handleLogout = () => {
    Alert.alert(
        'Cerrar Sesión',
        '¿Deseas salir de tu cuenta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => logout() }
        ]
    );
  };

  const toggleMode = () => {
    const nuevoModo = mode === 'patient' ? 'clinic' : 'patient';
    setMode(nuevoModo);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil del Usuario</Text>

        {user && (
            <View style={styles.infoCard}>
              <Text style={styles.label}>Nombre completo:</Text>
              <Text style={styles.value}>{user.nombre}</Text>

              <Text style={styles.label}>Número de Póliza:</Text>
              <Text style={styles.value}>{user.numeroPoliza}</Text>

              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
        )}

        {/* Botón para cambiar entre vista de Paciente y vista de Clínica */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Modo Actual: <Text style={styles.bold}>{mode.toUpperCase()}</Text></Text>
          <Button
              title={`Cambiar a vista de ${mode === 'patient' ? 'Clínica' : 'Paciente'}`}
              color="#0056b3"
              onPress={toggleMode}
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
  switchContainer: { backgroundColor: '#e9ecef', padding: 15, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  switchText: { fontSize: 16, marginBottom: 10, color: '#333' },
  bold: { fontWeight: 'bold', color: '#0056b3' },
  buttonContainer: { marginTop: 10 }
});