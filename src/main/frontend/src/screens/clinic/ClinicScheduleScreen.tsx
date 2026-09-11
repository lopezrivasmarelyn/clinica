import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../theme/theme';

export const ClinicScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(3);

  const days = [
    { day: 'Lun', date: '22' },
    { day: 'Mar', date: '23' },
    { day: 'Mié', date: '24' },
    { day: 'Jue', date: '25' },
    { day: 'Vie', date: '26' },
    { day: 'Sáb', date: '27' },
    { day: 'Dom', date: '28' },
  ];

  const doctors = [
    { id: '1', name: 'Dr. Carlos Mendoza', spec: 'Cardiología', status: 'high', slots: 8 },
    { id: '2', name: 'Dra. Ana Silva', spec: 'Neurología', status: 'almost', slots: 2 },
    { id: '3', name: 'Dr. Luis García', spec: 'Pediatría', status: 'full', slots: 0 },
  ];

  const renderBadge = (status: string, slots: number) => {
    if (status === 'high') {
      return (
        <View style={[styles.badge, { backgroundColor: '#E8F5E9', borderColor: COLORS.success }]}>
          <View style={[styles.badgeDot, { backgroundColor: COLORS.success }]} />
          <Text style={[styles.badgeText, { color: COLORS.success }]}>Alta disp.</Text>
        </View>
      );
    } else if (status === 'almost') {
      return (
        <View style={[styles.badge, { backgroundColor: '#FFF8E1', borderColor: COLORS.warning }]}>
          <View style={[styles.badgeDot, { backgroundColor: COLORS.warning }]} />
          <Text style={[styles.badgeText, { color: '#B45309' }]}>Quedan {slots} cupos</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.badge, { backgroundColor: '#FFEBEE', borderColor: COLORS.danger }]}>
          <View style={[styles.badgeDot, { backgroundColor: COLORS.danger }]} />
          <Text style={[styles.badgeText, { color: COLORS.danger }]}>Agotado</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Disponibilidad</Text>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelector}>
          {days.map((d, index) => {
            const isSelected = selectedDate === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                onPress={() => setSelectedDate(index)}
              >
                <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>{d.day}</Text>
                <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{d.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {doctors.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <View style={styles.doctorInfoRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{doc.name.substring(4, 6)}</Text>
              </View>
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{doc.name}</Text>
                <Text style={styles.doctorSpec}>{doc.spec}</Text>
              </View>
            </View>
            
            <View style={styles.doctorFooter}>
              {renderBadge(doc.status, doc.slots)}
              
              <TouchableOpacity 
                style={[styles.manageButton, doc.status === 'full' && styles.manageButtonDisabled]}
                disabled={doc.status === 'full'}
              >
                <Text style={[styles.manageButtonText, doc.status === 'full' && styles.manageButtonTextDisabled]}>
                  {doc.status === 'full' ? 'Cerrado' : 'Asignar Cita'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  dateSelector: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, gap: SPACING.sm },
  dateItem: { width: 56, height: 72, borderRadius: 16, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  dateItemSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateDay: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  dateDaySelected: { color: 'rgba(255,255,255,0.8)' },
  dateNum: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  dateNumSelected: { color: '#FFF' },
  listContainer: { padding: SPACING.lg },
  doctorCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  doctorInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  doctorDetails: { marginLeft: SPACING.md, flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  doctorSpec: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  doctorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.background },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  manageButton: { backgroundColor: 'rgba(13,110,253,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  manageButtonDisabled: { backgroundColor: COLORS.background },
  manageButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  manageButtonTextDisabled: { color: COLORS.textSecondary },
});
