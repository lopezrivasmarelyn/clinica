import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Plus, Clock, Stethoscope, DollarSign, X, CheckCircle, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AppointmentsScreen = () => {
  const { user, seniorMode, appointments, doctors, professions, bookAppointment, updateAppointmentStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<'pending' | 'future' | 'past'>('future');

  // Modal para agendar cita
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [errorMsg, setErrorMsg] = useState('');

  // Fechas reales disponibles (próximos 7 días)
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));
  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

  // Citas reales del paciente actual
  const myAppts = appointments.filter((a) => a.patientId === user?.id);
  const pendingList = myAppts.filter((a) => a.status === 'pending');
  const futureList = myAppts.filter((a) => a.status === 'confirmed');
  const pastList = myAppts.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  const handleBook = async () => {
    setErrorMsg('');
    if (!selectedDoctorId) {
      setErrorMsg('Selecciona un especialista.');
      return;
    }

    const dateStr = format(availableDates[selectedDateIndex], 'yyyy-MM-dd');
    const res = await bookAppointment({
      doctorId: selectedDoctorId,
      date: dateStr,
      time: selectedTime,
    });

    if (res.success) {
      setModalVisible(false);
      setActiveTab('pending');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const selectedDoc = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={[styles.title, seniorMode && styles.seniorTitle]}>Mis Citas</Text>
      </View>

      {/* Selector de 3 Pestañas */}
      <View style={[styles.tabsContainer, seniorMode && { height: 60 }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText, seniorMode && styles.seniorTabText]}>
            Pendientes ({pendingList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'future' && styles.activeTab]}
          onPress={() => setActiveTab('future')}
        >
          <Text style={[styles.tabText, activeTab === 'future' && styles.activeTabText, seniorMode && styles.seniorTabText]}>
            Futuras ({futureList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText, seniorMode && styles.seniorTabText]}>
            Anteriores ({pastList.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {/* Pestaña: Pendientes */}
        {activeTab === 'pending' && (
          <>
            {pendingList.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={40} color={COLORS.textSecondary} />
                <Text style={[styles.emptyText, seniorMode && styles.seniorEmptyText]}>
                  No tienes solicitudes pendientes de aprobación.
                </Text>
              </View>
            ) : (
              pendingList.map((appt) => (
                <View key={appt.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardDate, seniorMode && styles.seniorCardDate]}>{appt.date} • {appt.time}</Text>
                    <View style={styles.badgePending}>
                      <Text style={styles.badgePendingText}>En Espera</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardProc, seniorMode && styles.seniorCardProc]}>{appt.professionName}</Text>
                  <Text style={[styles.cardDoc, seniorMode && styles.seniorCardDoc]}>{appt.doctorName}</Text>
                  <Text style={styles.priceTag}>Costo estimado: ${appt.price}</Text>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => updateAppointmentStatus(appt.id, 'cancelled')}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar Solicitud</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        {/* Pestaña: Futuras / Confirmadas */}
        {activeTab === 'future' && (
          <>
            {futureList.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={40} color={COLORS.textSecondary} />
                <Text style={[styles.emptyText, seniorMode && styles.seniorEmptyText]}>
                  No tienes citas futuras confirmadas.
                </Text>
              </View>
            ) : (
              futureList.map((appt) => (
                <View key={appt.id} style={[styles.card, { borderColor: COLORS.primary }]}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardDate, seniorMode && styles.seniorCardDate]}>{appt.date} • {appt.time}</Text>
                    <View style={styles.badgeConfirmed}>
                      <Text style={styles.badgeConfirmedText}>Confirmada</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardProc, seniorMode && styles.seniorCardProc]}>{appt.professionName}</Text>
                  <Text style={[styles.cardDoc, seniorMode && styles.seniorCardDoc]}>{appt.doctorName}</Text>
                  <Text style={styles.priceTag}>Costo de consulta: ${appt.price}</Text>
                </View>
              ))
            )}
          </>
        )}

        {/* Pestaña: Anteriores / Historial */}
        {activeTab === 'past' && (
          <>
            {pastList.length === 0 ? (
              <View style={styles.emptyState}>
                <CheckCircle size={40} color={COLORS.textSecondary} />
                <Text style={[styles.emptyText, seniorMode && styles.seniorEmptyText]}>
                  No hay citas en el historial anterior.
                </Text>
              </View>
            ) : (
              pastList.map((appt) => (
                <View key={appt.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardDate, seniorMode && styles.seniorCardDate]}>{appt.date} • {appt.time}</Text>
                    <Text style={[styles.cardCost, seniorMode && styles.seniorCardCost]}>${appt.price}</Text>
                  </View>
                  <Text style={[styles.cardProc, seniorMode && styles.seniorCardProc]}>{appt.professionName}</Text>
                  <Text style={[styles.cardDoc, seniorMode && styles.seniorCardDoc]}>{appt.doctorName}</Text>
                  <Text style={[styles.statusNote, { color: appt.status === 'completed' ? COLORS.success : '#DC3545' }]}>
                    {appt.status === 'completed' ? 'Atendida con éxito' : 'Cancelada'}
                  </Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Botón Flotante para Agendar */}
      <TouchableOpacity
        style={[styles.fab, seniorMode && styles.seniorFab]}
        onPress={() => {
          setErrorMsg('');
          if (!selectedDoctorId && doctors.length > 0) setSelectedDoctorId(doctors[0].id);
          setModalVisible(true);
        }}
      >
        <Plus size={seniorMode ? 32 : 24} color="#FFF" />
      </TouchableOpacity>

      {/* Modal para Agendar Cita */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agendar Cita Médica</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {errorMsg ? (
                <View style={styles.modalError}>
                  <Text style={styles.modalErrorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {doctors.length === 0 ? (
                <Text style={styles.noDocsText}>Aún no hay doctores registrados en el sistema.</Text>
              ) : (
                <>
                  <Text style={styles.modalSectionLabel}>1. Selecciona Especialista</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                    {doctors.map((doc) => {
                      const isSel = selectedDoctorId === doc.id;
                      return (
                        <TouchableOpacity
                          key={doc.id}
                          style={[styles.docChip, isSel && styles.docChipActive]}
                          onPress={() => setSelectedDoctorId(doc.id)}
                        >
                          <Text style={[styles.docChipName, isSel && styles.docChipNameActive]}>{doc.name}</Text>
                          <Text style={[styles.docChipSpec, isSel && styles.docChipSpecActive]}>{doc.professionName}</Text>
                          <Text style={[styles.docChipPrice, isSel && styles.docChipPriceActive]}>${doc.price}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {selectedDoc && (
                    <View style={styles.docInfoSummary}>
                      <Text style={styles.summaryText}>Ubicación: {selectedDoc.room}</Text>
                      <Text style={styles.summaryText}>Días: {selectedDoc.schedule.days.join(', ')}</Text>
                    </View>
                  )}

                  <Text style={styles.modalSectionLabel}>2. Selecciona Fecha</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                    {availableDates.map((d, idx) => {
                      const isSel = selectedDateIndex === idx;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[styles.dateChip, isSel && styles.dateChipActive]}
                          onPress={() => setSelectedDateIndex(idx)}
                        >
                          <Text style={[styles.dateChipDay, isSel && styles.dateChipDayActive]}>
                            {format(d, 'EEE', { locale: es })}
                          </Text>
                          <Text style={[styles.dateChipNum, isSel && styles.dateChipNumActive]}>
                            {format(d, 'dd')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <Text style={styles.modalSectionLabel}>3. Selecciona Horario</Text>
                  <View style={styles.slotsGrid}>
                    {timeSlots.map((t) => {
                      const isSel = selectedTime === t;
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.timeChip, isSel && styles.timeChipActive]}
                          onPress={() => setSelectedTime(t)}
                        >
                          <Text style={[styles.timeChipText, isSel && styles.timeChipTextActive]}>{t}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity style={styles.btnConfirmBook} onPress={handleBook}>
                    <Text style={styles.btnConfirmBookText}>CONFIRMAR Y SOLICITAR CITA</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  seniorTitle: { fontSize: 36 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '700' },
  seniorTabText: { fontSize: 18 },
  activeTabText: { color: COLORS.primary },
  listContainer: { padding: SPACING.lg, paddingBottom: 100 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardDate: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  seniorCardDate: { fontSize: 16 },
  badgePending: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgePendingText: { color: '#B45309', fontSize: 11, fontWeight: 'bold' },
  badgeConfirmed: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeConfirmedText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  cardProc: { fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  seniorCardProc: { fontSize: 22 },
  cardDoc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  seniorCardDoc: { fontSize: 18 },
  cardCost: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  seniorCardCost: { fontSize: 20 },
  priceTag: { fontSize: 13, fontWeight: '600', color: COLORS.primary, marginTop: 8 },
  cancelBtn: { marginTop: 10, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#FFF1F2', borderRadius: 8, borderWidth: 1, borderColor: '#FECDD3' },
  cancelBtnText: { color: '#DC3545', fontSize: 12, fontWeight: 'bold' },
  statusNote: { fontSize: 12, fontWeight: 'bold', marginTop: 6 },
  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 15, marginTop: 10, textAlign: 'center' },
  seniorEmptyText: { fontSize: 20 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 6 },
  seniorFab: { width: 72, height: 72, borderRadius: 36, bottom: 32, right: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  modalError: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 12 },
  modalErrorText: { color: '#991B1B', fontSize: 13, textAlign: 'center' },
  noDocsText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginVertical: 30 },
  modalSectionLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginTop: 10, marginBottom: 8 },
  docChip: { padding: 12, borderRadius: 12, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, marginRight: 10, minWidth: 120 },
  docChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  docChipName: { fontSize: 13, fontWeight: 'bold', color: COLORS.text },
  docChipNameActive: { color: '#FFF' },
  docChipSpec: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  docChipSpecActive: { color: 'rgba(255,255,255,0.85)' },
  docChipPrice: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  docChipPriceActive: { color: '#FFF' },
  docInfoSummary: { backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, marginBottom: 8 },
  summaryText: { fontSize: 12, color: '#166534', fontWeight: '500' },
  dateChip: { width: 54, height: 64, borderRadius: 12, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  dateChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateChipDay: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'capitalize' },
  dateChipDayActive: { color: 'rgba(255,255,255,0.85)' },
  dateChipNum: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 2 },
  dateChipNumActive: { color: '#FFF' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  timeChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  timeChipTextActive: { color: '#FFF' },
  btnConfirmBook: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  btnConfirmBookText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});
