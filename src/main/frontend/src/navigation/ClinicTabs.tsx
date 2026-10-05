import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarDays, ClipboardList, Building2 } from 'lucide-react-native';
import  ClinicScheduleScreen  from '../screens/clinic/ClinicScheduleScreen';
import  ClinicAppointmentsScreen  from '../screens/clinic/ClinicAppointmentsScreen';
import  ClinicProfileScreen  from '../screens/clinic/ClinicProfileScreen';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const ClinicTabs = () => {
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
        }
      }}
    >
      <Tab.Screen 
        name="Agenda" 
        component={ClinicAppointmentsScreen} 
        options={{
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Disponibilidad" 
        component={ClinicScheduleScreen} 
        options={{
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Clínica" 
        component={ClinicProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <Building2 size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};
