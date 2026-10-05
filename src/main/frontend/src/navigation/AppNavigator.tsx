import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PatientTabs } from './PatientTabs';
import { ClinicTabs } from './ClinicTabs';
import { LoginScreen } from '../screens/LoginScreen';
import { useAppContext } from '../context/AppContext';

export const AppNavigator = () => {
    const { mode, user, cargandoSesion } = useAppContext();

    // Mientras lee el disco del teléfono, mostramos una pantalla de carga neutra
    if (cargandoSesion) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0056b3" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {!user ? (
                <LoginScreen />
            ) : mode === 'patient' ? (
                <PatientTabs />
            ) : (
                <ClinicTabs />
            )}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});