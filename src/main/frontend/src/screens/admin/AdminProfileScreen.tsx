import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, LogOut, Users, Award, Calendar } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AdminProfileScreen = () => {
  const { user, logout, doctors, professions, appointments } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Panel de Administración</Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={36} color="#FFF" />
          </View>
          <Text style={styles.name}>{user?.name || 'Administrador'}</Text>
          <Text style={styles.email}>{user?.email || 'admin@sgc.med'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>ADMINISTRADOR PRINCIPAL</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Users size={22} color={COLORS.primary} />
            <Text style={styles.statNumber}>{doctors.length}</Text>
            <Text style={styles.statLabel}>Doctores</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={22} color={COLORS.primary} />
            <Text style={styles.statNumber}>{professions.length}</Text>
            <Text style={styles.statLabel}>Especialidades</Text>
          </View>
          <View style={styles.statBox}>
            <Calendar size={22} color={COLORS.primary} />
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Citas Totales</Text>
          </View>
        </View>

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
  email: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  roleBadge: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
  roleText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 10 },
  statsGrid: { flexDirection: 'row', gap: 12, marginTop: SPACING.lg },
  statBox: { flex: 1, backgroundColor: COLORS.card, padding: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 6 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3', padding: 16, borderRadius: 12, gap: 8, marginBottom: SPACING.md },
  logoutText: { color: '#DC3545', fontWeight: 'bold', fontSize: 16 },
});
