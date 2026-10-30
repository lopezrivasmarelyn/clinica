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
import { Bell, Clock, Calendar, Check, X, CheckCheck, User, Phone, PhoneCall } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const DoctorRequestsScreen = () => {
  const { user, appointments, updateAppointmentStatus, doctors } = useAppContext();
  const [tab, setTab] = useState<'pending' | 'confirmed'>('pending');

  // Obtener doctor actual
  const currentDoc = doctors.find((d) => d.email.toLowerCase() === user?.email.toLowerCase() || d.id === user?.doctorId);

  // Filtrar citas asignadas a este doctor
  const myAppointments = appointments.filter((a) => {
    if (currentDoc) return a.doctorId === currentDoc.id;
    return a.doctorName.toLowerCase().includes(user?.name.toLowerCase() || '');
  });

  const pendingRequests = myAppointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = myAppointments.filter((a) => a.status === 'confirmed');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitudes y Citas</Text>
        <Text style={styles.subtitle}>{user?.name} • {currentDoc?.professionName || 'Especialista'}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'pending' && styles.tabBtnActive]}
          onPress={() => setTab('pending')}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>
            Solicitudes ({pendingRequests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'confirmed' && styles.tabBtnActive]}
          onPress={() => setTab('confirmed')}
        >
          <Text style={[styles.tabText, tab === 'confirmed' && styles.tabTextActive]}>
            Confirmadas ({confirmedAppointments.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {tab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Bell size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No tienes solicitudes pendientes.</Text>
                <Text style={styles.emptySubtext}>Nuevas solicitudes de pacientes aparecerán aquí.</Text>
              </View>
            ) : (
              pendingRequests.map((appt) => (
                <View key={appt.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      <User size={22} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.patientName}>{appt.patientName}</Text>
                      <TouchableOpacity
                        style={styles.phoneTouch}
                        onPress={() => Linking.openURL(`tel:${appt.patientPhone}`)}
                      >
                        <PhoneCall size={12} color={COLORS.primary} />
                        <Text style={styles.patientPhone}>{appt.patientPhone}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.badgePending}>
                      <Text style={styles.badgePendingText}>Por Aprobar</Text>
                    </View>
                  </View>

                  <View style={styles.timeInfoBox}>
                    <Calendar size={14} color={COLORS.primary} />
                    <Text style={styles.timeInfoText}>{appt.date}</Text>
                    <Clock size={14} color={COLORS.primary} style={{ marginLeft: 10 }} />
                    <Text style={styles.timeInfoText}>{appt.time}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.btnAction, { backgroundColor: '#FEE2E2' }]}
                      onPress={() => updateAppointmentStatus(appt.id, 'cancelled')}
                    >
                      <X size={16} color="#DC3545" />
                      <Text style={[styles.btnActionText, { color: '#DC3545' }]}>Rechazar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnAction, { backgroundColor: COLORS.primary }]}
                      onPress={() => updateAppointmentStatus(appt.id, 'confirmed')}
                    >
                      <Check size={16} color="#FFF" />
                      <Text style={[styles.btnActionText, { color: '#FFF' }]}>Aceptar Cita</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {tab === 'confirmed' && (
          <>
            {confirmedAppointments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Calendar size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No tienes citas confirmadas activas.</Text>
              </View>
            ) : (
              confirmedAppointments.map((appt) => (
                <View key={appt.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={[styles.avatar, { backgroundColor: '#E8F5E9' }]}>
                      <User size={22} color={COLORS.success} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.patientName}>{appt.patientName}</Text>
                      <TouchableOpacity
                        style={styles.phoneTouch}
                        onPress={() => Linking.openURL(`tel:${appt.patientPhone}`)}
                      >
                        <PhoneCall size={12} color={COLORS.success} />
                        <Text style={[styles.patientPhone, { color: COLORS.success }]}>{appt.patientPhone}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.badgeConfirmed}>
                      <Text style={styles.badgeConfirmedText}>Confirmada</Text>
                    </View>
                  </View>

                  <View style={styles.timeInfoBox}>
                    <Calendar size={14} color={COLORS.success} />
                    <Text style={styles.timeInfoText}>{appt.date}</Text>
                    <Clock size={14} color={COLORS.success} style={{ marginLeft: 10 }} />
                    <Text style={styles.timeInfoText}>{appt.time}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.btnComplete}
                    onPress={() => updateAppointmentStatus(appt.id, 'completed')}
                  >
                    <CheckCheck size={18} color="#FFF" />
                    <Text style={styles.btnCompleteText}>Marcar como Atendida</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
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
  tabsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 10, marginBottom: SPACING.md },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#E5E7EB', alignItems: 'center' },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: 'bold', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },
  listContainer: { padding: SPACING.lg, paddingTop: 0 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 12 },
  emptySubtext: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  patientName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  patientPhone: { fontSize: 12, color: COLORS.textSecondary },
  phoneTouch: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  badgePending: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgePendingText: { color: '#B45309', fontSize: 11, fontWeight: 'bold' },
  badgeConfirmed: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeConfirmedText: { color: COLORS.success, fontSize: 11, fontWeight: 'bold' },
  timeInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 10, borderRadius: 10, marginTop: 12 },
  timeInfoText: { fontSize: 13, color: COLORS.text, fontWeight: '600', marginLeft: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  btnActionText: { fontWeight: 'bold', fontSize: 13 },
  btnComplete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.success, paddingVertical: 12, borderRadius: 10, marginTop: 12, gap: 8 },
  btnCompleteText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});
