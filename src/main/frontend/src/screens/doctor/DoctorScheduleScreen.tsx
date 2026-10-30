import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, AlertCircle, XCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const DoctorScheduleScreen = () => {
  const { user, appointments, doctors } = useAppContext();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Generar 14 días reales a partir de hoy
  const daysList = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const selectedDateStr = format(daysList[selectedDayIndex], 'yyyy-MM-dd');

  // Encontrar doctor
  const currentDoc = doctors.find((d) => d.email.toLowerCase() === user?.email.toLowerCase() || d.id === user?.doctorId);
  const maxSlots = currentDoc?.schedule?.slotsPerDay || 8;

  // Citas del doctor para la fecha seleccionada
  const dateAppointments = appointments.filter((a) => {
    const isDoc = currentDoc ? a.doctorId === currentDoc.id : true;
    return isDoc && a.date === selectedDateStr && a.status !== 'cancelled';
  });

  const bookedSlots = dateAppointments.length;
  const remainingSlots = Math.max(0, maxSlots - bookedSlots);

  // Estado semántico de disponibilidad
  let availStatus: 'high' | 'almost' | 'full' = 'high';
  if (remainingSlots === 0) {
    availStatus = 'full';
  } else if (remainingSlots <= 2) {
    availStatus = 'almost';
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Disponibilidad</Text>
        <Text style={styles.subtitle}>Sincronizado con fecha actual: {format(new Date(), 'dd MMMM yyyy', { locale: es })}</Text>
      </View>

      {/* Selector Horizontal de Fechas Reales */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {daysList.map((d, index) => {
            const isSelected = selectedDayIndex === index;
            const dayName = format(d, 'EEE', { locale: es });
            const dayNum = format(d, 'dd');
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCard, isSelected && styles.dayCardActive]}
                onPress={() => setSelectedDayIndex(index)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{dayName}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{dayNum}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Tarjeta de Resumen del Día */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryDate}>
                {format(daysList[selectedDayIndex], 'EEEE, dd MMMM', { locale: es })}
              </Text>
              <Text style={styles.summaryHours}>
                Horario: {currentDoc?.schedule?.startHour || '09:00'} - {currentDoc?.schedule?.endHour || '17:00'}
              </Text>
            </View>

            {/* Píldora Semántica */}
            {availStatus === 'high' && (
              <View style={[styles.badge, styles.badgeHigh]}>
                <CheckCircle2 size={14} color={COLORS.success} />
                <Text style={[styles.badgeText, { color: COLORS.success }]}>Alta disp.</Text>
              </View>
            )}
            {availStatus === 'almost' && (
              <View style={[styles.badge, styles.badgeAlmost]}>
                <AlertCircle size={14} color="#B45309" />
                <Text style={[styles.badgeText, { color: '#B45309' }]}>Quedan {remainingSlots}</Text>
              </View>
            )}
            {availStatus === 'full' && (
              <View style={[styles.badge, styles.badgeFull]}>
                <XCircle size={14} color={COLORS.danger} />
                <Text style={[styles.badgeText, { color: COLORS.danger }]}>Agotado</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Cupos Totales</Text>
              <Text style={styles.statValue}>{maxSlots}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Agendadas</Text>
              <Text style={styles.statValue}>{bookedSlots}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Disponibles</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{remainingSlots}</Text>
            </View>
          </View>
        </View>

        {/* Lista de Citas Programadas para este día */}
        <Text style={styles.sectionTitle}>Citas para esta fecha</Text>

        {dateAppointments.length === 0 ? (
          <View style={styles.emptyDayBox}>
            <Clock size={36} color={COLORS.textSecondary} />
            <Text style={styles.emptyDayText}>No hay citas programadas para este día.</Text>
          </View>
        ) : (
          dateAppointments.map((appt) => (
            <View key={appt.id} style={styles.apptCard}>
              <View style={styles.apptTime}>
                <Text style={styles.apptTimeText}>{appt.time}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.apptPatient}>{appt.patientName}</Text>
                <Text style={styles.apptPhone}>Tel: {appt.patientPhone}</Text>
                <Text style={styles.apptStatus}>
                  Estado: {appt.status === 'confirmed' ? 'Confirmada' : appt.status === 'pending' ? 'Pendiente' : 'Atendida'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  daysScroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: 10 },
  dayCard: { width: 58, height: 74, backgroundColor: COLORS.card, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  dayCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayName: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'capitalize' },
  dayNameActive: { color: 'rgba(255,255,255,0.85)' },
  dayNum: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  dayNumActive: { color: '#FFF' },
  contentContainer: { padding: SPACING.lg },
  summaryCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, elevation: 1 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryDate: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, textTransform: 'capitalize' },
  summaryHours: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, borderWidth: 1 },
  badgeHigh: { backgroundColor: '#E8F5E9', borderColor: COLORS.success },
  badgeAlmost: { backgroundColor: '#FFFBEB', borderColor: COLORS.warning },
  badgeFull: { backgroundColor: '#FEE2E2', borderColor: COLORS.danger },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: 14, paddingTop: 12 },
  statCol: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  emptyDayBox: { backgroundColor: COLORS.card, borderRadius: 14, padding: SPACING.xl, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyDayText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  apptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  apptTime: { backgroundColor: '#F0F7FF', paddingHorizontal: 12, paddingVertical: 14, borderRadius: 10 },
  apptTimeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  apptPatient: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  apptPhone: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  apptStatus: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
});
