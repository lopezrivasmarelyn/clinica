import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const PatientHomeScreen = () => {
  const { seniorMode } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, seniorMode && styles.seniorGreeting]}>¡Hola, Juan!</Text>
            <Text style={[styles.subtitle, seniorMode && styles.seniorSubtitle]}>Tu salud es nuestra prioridad hoy.</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0D6EFD&color=fff' }} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PRÓXIMA CITA</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>CONFIRMADA</Text>
            </View>
          </View>
          
          <Text style={[styles.specialty, seniorMode && styles.seniorSpecialty]}>Cardiología</Text>
          
          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Clock size={seniorMode ? 24 : 18} color={COLORS.textSecondary} />
              <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>Mañana, 10:00 AM</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailIcon, seniorMode && { fontSize: 20 }]}>👨‍⚕️</Text>
              <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>Dr. Roberto Salas</Text>
            </View>
            <View style={styles.detailRow}>
              <MapPin size={seniorMode ? 24 : 18} color={COLORS.textSecondary} />
              <Text style={[styles.detailText, seniorMode && styles.seniorDetailText]}>Consultorio 304, Ala Sur</Text>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ctaBanner}>
          <Text style={[styles.ctaTitle, seniorMode && styles.seniorCtaTitle]}>¿Necesitas otra consulta?</Text>
          <Text style={[styles.ctaSubtitle, seniorMode && styles.seniorCtaSubtitle]}>Encuentra disponibilidad rápida.</Text>
          <TouchableOpacity style={[styles.ctaButton, seniorMode && { minHeight: 56 }]}>
            <Text style={styles.ctaButtonText}>AGENDAR NUEVA CITA</Text>
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
  specialty: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.lg },
  seniorSpecialty: { fontSize: 36 },
  appointmentDetails: { gap: 12, marginBottom: SPACING.xl },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: { fontSize: 16 },
  detailText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  seniorDetailText: { fontSize: 20 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  secondaryButton: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { color: COLORS.primary, fontWeight: 'bold' },
  primaryButton: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold' },
  ctaBanner: { backgroundColor: COLORS.primary, borderRadius: 16, padding: SPACING.lg, alignItems: 'center' },
  ctaTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  seniorCtaTitle: { fontSize: 26 },
  ctaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: SPACING.lg },
  seniorCtaSubtitle: { fontSize: 18 },
  ctaButton: { backgroundColor: '#FFF', width: '100%', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
