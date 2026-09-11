import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PatientTabs } from './PatientTabs';
import { ClinicTabs } from './ClinicTabs';
import { useAppContext } from '../context/AppContext';

export const AppNavigator = () => {
  const { mode } = useAppContext();

  return (
    <NavigationContainer>
      {mode === 'patient' ? <PatientTabs /> : <ClinicTabs />}
    </NavigationContainer>
  );
};
