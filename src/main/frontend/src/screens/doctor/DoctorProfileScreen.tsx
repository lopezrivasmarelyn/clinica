import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stethoscope, LogOut, Clock, Calendar, MapPin, DollarSign, Phone } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const DoctorProfileScreen = () => {
  const { user, logout, doctors } = useAppContext();

  const currentDoc = doctors.find((d) => d.email.toLowerCase() === user?.email.toLowerCase() || d.id === user?.doctorId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil del Especialista</Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Stethoscope size={36} color="#FFF" />
          </View>
          <Text style={styles.name}>{user?.name || currentDoc?.name || 'Doctor'}</Text>
          <Text style={styles.spec}>{currentDoc?.professionName || 'Especialista Médico'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {currentDoc && (
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <MapPin size={18} color={COLORS.primary} />
              <Text style={styles.detailText}>{currentDoc.room}</Text>
            </View>
            <View style={styles.detailRow}>
              <DollarSign size={18} color={COLORS.primary} />
              <Text style={styles.detailText}>Precio consulta: ${currentDoc.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={18} color={COLORS.primary} />
              <Text style={styles.detailText}>Días: {currentDoc.schedule.days.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color={COLORS.primary} />
              <Text style={styles.detailText}>Horario: {currentDoc.schedule.startHour} a {currentDoc.schedule.endHour}</Text>
            </View>
            {currentDoc.phone ? (
              <View style={styles.detailRow}>
                <Phone size={18} color="#059669" />
                <Text style={[styles.detailText, { fontWeight: 'bold' }]}>{currentDoc.phone}</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={20} color="#DC3545" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.primary, borderRadius: 20, padding: SPACING.xl, alignItems: 'center' },
  iconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  spec: { fontSize: 14, color: '#E0F2FE', marginTop: 2, fontWeight: '600' },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  detailsBox: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3', padding: 16, borderRadius: 12, gap: 8, marginBottom: SPACING.md },
  logoutText: { color: '#DC3545', fontWeight: 'bold', fontSize: 16 },
});
