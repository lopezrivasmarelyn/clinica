import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bell, Calendar, UserCheck } from 'lucide-react-native';
import { DoctorRequestsScreen } from '../screens/doctor/DoctorRequestsScreen';
import { DoctorScheduleScreen } from '../screens/doctor/DoctorScheduleScreen';
import { DoctorProfileScreen } from '../screens/doctor/DoctorProfileScreen';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const DoctorTabs = () => {
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
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Solicitudes"
        component={DoctorRequestsScreen}
        options={{
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Disponibilidad"
        component={DoctorScheduleScreen}
        options={{
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={DoctorProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <UserCheck size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
