import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PatientTabs } from './PatientTabs';
import { DoctorTabs } from './DoctorTabs';
import { AdminTabs } from './AdminTabs';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { useAppContext } from '../context/AppContext';
import { COLORS } from '../theme/theme';

export const AppNavigator = () => {
  const { user, isLoadingAuth } = useAppContext();

  // Esperar a que se lea la sesión guardada del almacenamiento local
  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Si no hay sesión iniciada, mostrar la pantalla de Login / Registro
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      {user.role === 'admin' && <AdminTabs />}
      {user.role === 'doctor' && <DoctorTabs />}
      {user.role === 'patient' && <PatientTabs />}
    </NavigationContainer>
  );
};
