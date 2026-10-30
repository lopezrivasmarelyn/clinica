import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from '../context/AppContext';

export function LoginScreen() {
    const [numeroPoliza, setNumeroPoliza] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAppContext();

    const handleLogin = async () => {
        if (!numeroPoliza || !password) {
            Alert.alert('Atención', 'Por favor ingresa tu número de póliza y contraseña.');
            return;
        }

        setLoading(true);
        try {
            const result = await login(numeroPoliza, password);
            if (!result.success) {
                Alert.alert('Error de Autenticación', result.error || 'Póliza o contraseña incorrectas, o servidor no disponible.');
            }
        } catch (error: any) {
            Alert.alert('Error de Autenticación', 'Póliza o contraseña incorrectas, o servidor no disponible.');
        } finally {
            setLoading(false); // Detiene el spinner de carga siempre
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seguro Digital</Text>

            <TextInput
                style={styles.input}
                placeholder="Número de Póliza (Ej: POL-1001)"
                value={numeroPoliza}
                onChangeText={setNumeroPoliza}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0056b3" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#0056b3' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
});