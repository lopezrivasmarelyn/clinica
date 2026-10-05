import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, User } from 'lucide-react-native';
import  PatientHomeScreen  from '../screens/patient/HomeScreen';
import  AppointmentsScreen  from '../screens/patient/AppointmentsScreen';
import  ProfileScreen  from '../screens/patient/ProfileScreen';
import { COLORS } from '../theme/theme';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();

export const PatientTabs = () => {
  const { seniorMode } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: seniorMode ? 90 : 65,
          paddingBottom: seniorMode ? 15 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: seniorMode ? 16 : 12,
          fontWeight: 'bold',
        }
      }}
    >
      {!seniorMode && (
        <Tab.Screen 
          name="Inicio" 
          component={PatientHomeScreen} 
          options={{
            tabBarIcon: ({ color }) => <Home size={24} color={color} />
          }}
        />
      )}
      <Tab.Screen 
        name="Mis Citas" 
        component={AppointmentsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Calendar size={seniorMode ? 32 : 24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <User size={seniorMode ? 32 : 24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};
