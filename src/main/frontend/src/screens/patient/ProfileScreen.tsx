import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const ProfileScreen = () => {
  const { seniorMode, setSeniorMode, user, logout } = useAppContext();

  const displayName = user?.name || `${user?.firstName || 'Paciente'} ${user?.lastName || ''}`.trim();
  const displayCode = user?.patientCode || 'P-8472-991A';
  const displayPhone = user?.phone ? `Tel: ${user.phone}` : 'Tel: 87654321';
  const displayEmail = user?.email || 'paciente@correo.com';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, seniorMode && styles.seniorTitle]}>Mi Perfil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <User size={32} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, seniorMode && styles.seniorName]}>{displayName}</Text>
            <Text style={[styles.id, seniorMode && styles.seniorId]}>ID: {displayCode}</Text>
            <Text style={[styles.subInfo, seniorMode && styles.seniorSubInfo]}>{displayEmail} • {displayPhone}</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, seniorMode && styles.seniorSectionTitle]}>Accesibilidad</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, seniorMode && styles.seniorSettingTitle]}>
                  Modo de Visibilidad Alta (Adultos Mayores)
                </Text>
              </View>
              <Switch 
                value={seniorMode} 
                onValueChange={setSeniorMode}
                trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                thumbColor={'#FFF'}
                style={{ transform: [{ scaleX: seniorMode ? 1.3 : 1.1 }, { scaleY: seniorMode ? 1.3 : 1.1 }] }}
              />
            </View>
            <Text style={[styles.settingDescription, seniorMode && styles.seniorSettingDescription]}>
              Aumenta el tamaño de la letra, simplifica la navegación a solo 2 botones (Mis Citas / Perfil) y maximiza el contraste.
            </Text>
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          style={[styles.logoutButton, seniorMode && { minHeight: 60 }]}
          onPress={logout}
        >
          <LogOut size={seniorMode ? 26 : 20} color="#DC3545" />
          <Text style={[styles.logoutText, seniorMode && styles.seniorLogoutText]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xl },
  seniorTitle: { fontSize: 36 },
  profileCard: { backgroundColor: COLORS.primary, borderRadius: 16, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  seniorName: { fontSize: 26 },
  id: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  seniorId: { fontSize: 18 },
  settingsSection: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  seniorSectionTitle: { fontSize: 24 },
  settingCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  settingTextContainer: { flex: 1, paddingRight: SPACING.md },
  settingTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  seniorSettingTitle: { fontSize: 22 },
  settingDescription: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginTop: 8 },
  seniorSettingDescription: { fontSize: 18, lineHeight: 26 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  actionText: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  seniorActionText: { fontSize: 22 },
  subInfo: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  seniorSubInfo: { fontSize: 16 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    padding: SPACING.lg,
    borderRadius: 12,
    gap: 8,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC3545',
  },
  seniorLogoutText: {
    fontSize: 22,
  },
});
