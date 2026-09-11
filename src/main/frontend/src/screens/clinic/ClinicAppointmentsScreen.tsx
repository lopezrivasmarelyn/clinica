import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Search } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';

export const ClinicAppointmentsScreen = () => {
  const appointments = [
    { id: '1', time: '10:00', patient: 'Maria Garcia Vargas', doc: 'Dr. Roberto Salas', spec: 'Cardiología', status: 'En Espera' },
    { id: '2', time: '10:15', patient: 'Juan López Pérez', doc: 'Dra. Ana Medina', spec: 'Medicina General', status: 'En Consulta' },
    { id: '3', time: '09:30', patient: 'Carlos Ruiz S.', doc: 'Dr. Roberto Salas', spec: 'Cardiología', status: 'Por Cobrar' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Citas</Text>
        <Text style={styles.subtitle}>Hoy, 24 de Octubre</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {appointments.map((appt) => (
          <View key={appt.id} style={styles.card}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{appt.time}</Text>
            </View>
            <View style={styles.contentColumn}>
              <View style={styles.cardHeader}>
                <Text style={styles.patientName}>{appt.patient}</Text>
                <View style={[
                  styles.statusBadge, 
                  appt.status === 'En Consulta' ? styles.statusActive : 
                  appt.status === 'Por Cobrar' ? styles.statusWarning : styles.statusWaiting
                ]}>
                  <Text style={[
                    styles.statusText,
                    appt.status === 'En Consulta' ? styles.statusTextActive : 
                    appt.status === 'Por Cobrar' ? styles.statusTextWarning : styles.statusTextWaiting
                  ]}>{appt.status}</Text>
                </View>
              </View>
              <Text style={styles.doctorInfo}>{appt.doc} • {appt.spec}</Text>
              
              {appt.status === 'En Consulta' && (
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Finalizar Consulta</Text>
                </TouchableOpacity>
              )}
              {appt.status === 'Por Cobrar' && (
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonWarning]}>
                  <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Realizar Cobro</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  listContainer: { padding: SPACING.lg },
  card: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  timeColumn: { width: 50, borderRightWidth: 1, borderRightColor: COLORS.background, marginRight: SPACING.md, paddingTop: 4 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary },
  contentColumn: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 1, paddingRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusWaiting: { backgroundColor: '#F3F4F6' },
  statusActive: { backgroundColor: '#E0F2FE' },
  statusWarning: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextWaiting: { color: COLORS.textSecondary },
  statusTextActive: { color: COLORS.primary },
  statusTextWarning: { color: '#D97706' },
  doctorInfo: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.md },
  actionButton: { backgroundColor: 'rgba(13,110,253,0.1)', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionButtonWarning: { backgroundColor: COLORS.warning },
  actionButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
