import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Users, Award, Calendar, ShieldCheck } from 'lucide-react-native';
import { AdminDoctorsScreen } from '../screens/admin/AdminDoctorsScreen';
import { AdminProfessionsScreen } from '../screens/admin/AdminProfessionsScreen';
import { AdminAppointmentsScreen } from '../screens/admin/AdminAppointmentsScreen';
import { AdminProfileScreen } from '../screens/admin/AdminProfileScreen';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const AdminTabs = () => {
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
        name="Doctores"
        component={AdminDoctorsScreen}
        options={{
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profesiones"
        component={AdminProfessionsScreen}
        options={{
          tabBarIcon: ({ color }) => <Award size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={AdminAppointmentsScreen}
        options={{
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <ShieldCheck size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
