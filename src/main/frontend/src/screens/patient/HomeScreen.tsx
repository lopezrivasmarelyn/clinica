import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, Stethoscope, PlusCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const PatientHomeScreen = ({ navigation }: any) => {
  const { seniorMode, user, appointments, doctors } = useAppContext();
  const displayName = user?.firstName || user?.name || 'Paciente';

  // Buscar la próxima cita confirmada del usuario
  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const nextConfirmed = myAppointments.find((a) => a.status === 'confirmed');
  const nextDoc = doctors.find((d) => d.id === nextConfirmed?.doctorId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, seniorMode && styles.seniorGreeting]}>
              ¡Hola, {displayName}!
            </Text>
            <Text style={[styles.subtitle, seniorMode && styles.seniorSubtitle]}>
              Tu salud es nuestra prioridad hoy.
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || displayName)}&background=0D6EFD&color=fff` }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Tarjeta Hero: Próxima Cita Real */}
        {nextConfirmed ? (
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>PRÓXIMA CITA</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>CONFIRMADA</Text>
              </View>
            </View>

            <Text style={[styles.specialty, seniorMode && styles.seniorSpecialty]}>
              {nextConfirmed.professionName}
            </Text>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Clock size={seniorMode ? 24 : 18} color={COLORS.textSecondary} />
                <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>
                  {nextConfirmed.date} - {nextConfirmed.time}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Stethoscope size={seniorMode ? 24 : 18} color={COLORS.primary} />
                <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>
                  {nextConfirmed.doctorName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={seniorMode ? 24 : 18} color={COLORS.textSecondary} />
                <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>
                  {nextDoc?.room || 'Consultorio Principal'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.heroCard, { backgroundColor: '#F8FAFC' }]}>
            <View style={styles.heroHeader}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>AGENDA MÉDICA</Text>
              </View>
            </View>
            <Text style={[styles.specialty, { fontSize: 20 }, seniorMode && styles.seniorSpecialty]}>
              Sin citas confirmadas
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
              Puedes programar una consulta con nuestros especialistas desde la sección de citas.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation?.navigate('Mis Citas')}
            >
              <Text style={styles.primaryButtonText}>AGENDAR AHORA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={[styles.ctaTitle, seniorMode && styles.seniorCtaTitle]}>¿Necesitas otra consulta?</Text>
          <Text style={[styles.ctaSubtitle, seniorMode && styles.seniorCtaSubtitle]}>
            Contamos con {doctors.length} médicos y diversas especialidades disponibles.
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, seniorMode && { minHeight: 56 }]}
            onPress={() => navigation?.navigate('Mis Citas')}
          >
            <Text style={styles.ctaButtonText}>EXPLORAR ESPECIALISTAS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  seniorGreeting: { fontSize: 32 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  seniorSubtitle: { fontSize: 18 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  heroCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: COLORS.border },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  heroBadge: { backgroundColor: COLORS.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  heroBadgeText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textSecondary },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold', color: COLORS.success },
  specialty: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.lg },
  seniorSpecialty: { fontSize: 32 },
  appointmentDetails: { gap: 12, marginBottom: SPACING.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  seniorDetailText: { fontSize: 20 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  ctaBanner: { backgroundColor: COLORS.primary, borderRadius: 16, padding: SPACING.lg, alignItems: 'center' },
  ctaTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  seniorCtaTitle: { fontSize: 26 },
  ctaSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: SPACING.lg, textAlign: 'center' },
  seniorCtaSubtitle: { fontSize: 17 },
  ctaButton: { backgroundColor: '#FFF', width: '100%', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
