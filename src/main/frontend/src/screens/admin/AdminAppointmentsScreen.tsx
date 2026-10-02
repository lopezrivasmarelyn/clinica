import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, User, Stethoscope, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AdminAppointmentsScreen = () => {
  const { appointments, updateAppointmentStatus, doctors } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const filtered = appointments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda General</Text>
        <Text style={styles.subtitle}>{appointments.length} citas registradas en total</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'confirmed', 'completed'] as const).map((st) => {
          const labels = { all: 'Todas', pending: 'Pendientes', confirmed: 'Confirmadas', completed: 'Finalizadas' };
          const active = filter === st;
          return (
            <TouchableOpacity
              key={st}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
              onPress={() => setFilter(st)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{labels[st]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No hay citas con este estado.</Text>
          </View>
        ) : (
          filtered.map((appt) => {
            const doc = doctors.find((d) => d.id === appt.doctorId);
            return (
              <View key={appt.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.patientName}>{appt.patientName}</Text>
                    <Text style={styles.patientPhone}>Tel: {appt.patientPhone}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      appt.status === 'confirmed'
                        ? styles.statusConfirmed
                        : appt.status === 'completed'
                        ? styles.statusCompleted
                        : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        appt.status === 'confirmed'
                          ? styles.textConfirmed
                          : appt.status === 'completed'
                          ? styles.textCompleted
                          : styles.textPending,
                      ]}
                    >
                      {appt.status === 'confirmed'
                        ? 'Confirmada'
                        : appt.status === 'completed'
                        ? 'Finalizada'
                        : 'Pendiente'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.docInfo}>
                    <Stethoscope size={14} color={COLORS.primary} /> {appt.doctorName} • {appt.professionName}
                  </Text>
                  {doc?.phone ? (
                    <Text style={styles.docPhoneText}>Tel Doctor: {doc.phone}</Text>
                  ) : null}
                  <Text style={styles.timeInfo}>
                    <Clock size={14} color={COLORS.textSecondary} /> {appt.date} - {appt.time}
                  </Text>
                  <Text style={styles.priceInfo}>Monto: ${appt.price}</Text>
                </View>

                {/* Botones de Comunicación / Confirmación */}
                <View style={styles.callRow}>
                  <TouchableOpacity
                    style={styles.callPatientBtn}
                    onPress={() => Linking.openURL(`tel:${appt.patientPhone}`)}
                    activeOpacity={0.8}
                  >
                    <PhoneCall size={13} color="#FFF" />
                    <Text style={styles.callBtnText}>Llamar Paciente</Text>
                  </TouchableOpacity>

                  {doc?.phone ? (
                    <TouchableOpacity
                      style={styles.callDoctorBtn}
                      onPress={() => Linking.openURL(`tel:${doc.phone}`)}
                      activeOpacity={0.8}
                    >
                      <PhoneCall size={13} color="#FFF" />
                      <Text style={styles.callBtnText}>Llamar Doctor</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {appt.status === 'pending' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#DC3545' }]}
                      onPress={() => updateAppointmentStatus(appt.id, 'cancelled')}
                    >
                      <Text style={styles.actionBtnText}>Rechazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                      onPress={() => updateAppointmentStatus(appt.id, 'confirmed')}
                    >
                      <Text style={styles.actionBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E5E7EB' },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },
  listContainer: { padding: SPACING.lg, paddingTop: 0 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  patientName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  patientPhone: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusConfirmed: { backgroundColor: '#E0F2FE' },
  statusCompleted: { backgroundColor: '#E8F5E9' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  textPending: { color: '#B45309' },
  textConfirmed: { color: COLORS.primary },
  textCompleted: { color: COLORS.success },
  detailsRow: { marginTop: 12, gap: 6, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  docInfo: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  timeInfo: { fontSize: 12, color: COLORS.textSecondary },
  priceInfo: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  docPhoneText: { fontSize: 12, color: '#059669', fontWeight: 'bold' },
  callRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  callPatientBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  callDoctorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  callBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
