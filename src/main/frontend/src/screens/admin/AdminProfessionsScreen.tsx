import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Award, Trash2, X } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AdminProfessionsScreen = () => {
  const { professions, addProfession, deleteProfession, doctors } = useAppContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      setErrorMsg('El nombre de la profesión es obligatorio.');
      return;
    }
    await addProfession(name, description);
    setName('');
    setDescription('');
    setErrorMsg('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Especialidades</Text>
          <Text style={styles.subtitle}>{professions.length} registradas</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setErrorMsg('');
            setModalVisible(true);
          }}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {professions.map((prof) => {
          const docsCount = doctors.filter((d) => d.professionId === prof.id).length;
          return (
            <View key={prof.id} style={styles.card}>
              <View style={styles.iconCircle}>
                <Award size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.profName}>{prof.name}</Text>
                <Text style={styles.profDesc}>{prof.description || 'Sin descripción'}</Text>
                <Text style={styles.docCount}>{docsCount} doctores asignados</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteProfession(prof.id)}
                style={styles.deleteButton}
              >
                <Trash2 size={18} color="#DC3545" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal para Crear Profesión */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Especialidad</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={styles.modalError}>
                <Text style={styles.modalErrorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleCreate}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  listContainer: { padding: SPACING.lg, paddingTop: 0 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, elevation: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(13,110,253,0.1)', alignItems: 'center', justifyContent: 'center' },
  profName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  profDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  docCount: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  deleteButton: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  modalError: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 12 },
  modalErrorText: { color: '#991B1B', fontSize: 13, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: COLORS.text, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.text },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 10 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
