import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Plus } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AppointmentsScreen = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('past');
  const { seniorMode } = useAppContext();

  const pastAppointments = [
    { id: '1', date: '15 Oct 2023', doctor: 'Dr. Roberto Salas', proc: 'Chequeo General', cost: '$1,200.00' },
    { id: '2', date: '02 Sep 2023', doctor: 'Dra. Ana Medina', proc: 'Análisis de Sangre', cost: '$850.00' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={[styles.title, seniorMode && styles.seniorTitle]}>Mis Citas</Text>
      </View>

      <View style={[styles.tabsContainer, seniorMode && { height: 60 }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText, seniorMode && styles.seniorTabText]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText, seniorMode && styles.seniorTabText]}>
            Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {activeTab === 'past' && pastAppointments.map((appt, idx) => (
          <View key={appt.id} style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={styles.timelineDot} />
              {idx !== pastAppointments.length - 1 && <View style={styles.timelineLine} />}
            </View>
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardDate, seniorMode && styles.seniorCardDate]}>{appt.date}</Text>
                <Text style={[styles.cardCost, seniorMode && styles.seniorCardCost]}>{appt.cost}</Text>
              </View>
              <Text style={[styles.cardProc, seniorMode && styles.seniorCardProc]}>{appt.proc}</Text>
              <Text style={[styles.cardDoc, seniorMode && styles.seniorCardDoc]}>{appt.doctor}</Text>
              
              <TouchableOpacity style={[styles.actionButton, seniorMode && { minHeight: 50 }]}>
                <Calendar size={seniorMode ? 20 : 16} color={COLORS.primary} />
                <Text style={[styles.actionButtonText, seniorMode && styles.seniorActionButtonText]}>
                  Agendar de nuevo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {activeTab === 'upcoming' && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, seniorMode && styles.seniorEmptyText]}>
              No tienes citas próximas.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, seniorMode && styles.seniorFab]}>
        <Plus size={seniorMode ? 32 : 24} color="#FFF" />
      </TouchableOpacity>
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
  tabText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '600' },
  seniorTabText: { fontSize: 22 },
  activeTabText: { color: COLORS.primary },
  listContainer: { padding: SPACING.lg, paddingLeft: SPACING.md },
  timelineItem: { flexDirection: 'row', marginBottom: SPACING.lg },
  timelineIndicator: { alignItems: 'center', width: 30, marginRight: SPACING.sm },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginTop: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4 },
  card: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardDate: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  seniorCardDate: { fontSize: 18 },
  cardCost: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  seniorCardCost: { fontSize: 22 },
  cardProc: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  seniorCardProc: { fontSize: 24 },
  cardDoc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.md },
  seniorCardDoc: { fontSize: 18 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: 'rgba(13,110,253,0.1)', borderRadius: 8 },
  actionButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  seniorActionButtonText: { fontSize: 18 },
  emptyState: { padding: SPACING.xl, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
  seniorEmptyText: { fontSize: 22 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 6 },
  seniorFab: { width: 72, height: 72, borderRadius: 36, bottom: 32, right: 32 },
});
