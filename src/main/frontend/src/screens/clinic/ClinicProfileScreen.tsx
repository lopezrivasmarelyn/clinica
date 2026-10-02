import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, MapPin, Settings } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const ClinicProfileScreen = () => {
  const { logout } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Clínica Actual</Text>
        
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Building2 size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.clinicName}>CliniCore Medical Center</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={COLORS.textSecondary} />
            <Text style={styles.locationText}>Av. Reforma 123, Ciudad de México</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.fullWidthButton}>
          <Text style={styles.fullWidthButtonText}>Cambiar / Afiliar Otra Clínica</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={logout}
        >
          <Settings size={20} color={COLORS.textSecondary} />
          <Text style={styles.switchButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xl },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(13,110,253,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  clinicName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 14, color: COLORS.textSecondary },
  fullWidthButton: { width: '100%', backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: SPACING.md },
  fullWidthButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchButton: { width: '100%', backgroundColor: COLORS.card, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  switchButtonText: { color: COLORS.text, fontWeight: '500', fontSize: 16 },
});
