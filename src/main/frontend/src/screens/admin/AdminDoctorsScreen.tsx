import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, UserPlus, Stethoscope, Clock, Calendar, DollarSign, Trash2, X, Eye, EyeOff, ChevronDown, Phone, PhoneCall } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext, DoctorSchedule } from '../../context/AppContext';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const TIME_OPTIONS = [
  '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '08:00 PM'
];

export const AdminDoctorsScreen = () => {
  const { doctors, professions, addDoctor, deleteDoctor } = useAppContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [professionId, setProfessionId] = useState(professions[0]?.id || '');
  const [price, setPrice] = useState('');
  const [room, setRoom] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
  const [startHour, setStartHour] = useState('09:00 AM');
  const [endHour, setEndHour] = useState('05:00 PM');
  const [slotsPerDay, setSlotsPerDay] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateDoctor = async () => {
    setErrorMsg('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Nombre, correo y contraseña son obligatorios.');
      return;
    }
    if (!professionId) {
      setErrorMsg('Selecciona una especialidad.');
      return;
    }
    if (selectedDays.length === 0) {
      setErrorMsg('Selecciona al menos un día laboral.');
      return;
    }

    const schedule: DoctorSchedule = {
      days: selectedDays,
      startHour: startHour || '09:00 AM',
      endHour: endHour || '05:00 PM',
      slotsPerDay: parseInt(slotsPerDay, 10) || 8,
    };

    const res = await addDoctor({
      name,
      email,
      password,
      phone: phone.trim(),
      professionId,
      price: parseFloat(price) || 0,
      room: room.trim() || 'Consultorio',
      schedule,
    });

    if (res.success) {
      setModalVisible(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setPrice('');
      setRoom('');
      setSlotsPerDay('');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gestión de Doctores</Text>
          <Text style={styles.subtitle}>{doctors.length} especialistas registrados</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setErrorMsg('');
            if (!professionId && professions.length > 0) setProfessionId(professions[0].id);
            setModalVisible(true);
          }}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {doctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Stethoscope size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No hay doctores registrados.</Text>
          </View>
        ) : (
          doctors.map((doc) => (
            <View key={doc.id} style={styles.doctorCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{doc.name.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.doctorName}>{doc.name}</Text>
                  <Text style={styles.doctorSpec}>{doc.professionName}</Text>
                  <Text style={styles.doctorEmail}>{doc.email}</Text>
                  {doc.phone ? (
                    <Text style={styles.doctorPhone}>Tel: {doc.phone}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => deleteDoctor(doc.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={18} color="#DC3545" />
                </TouchableOpacity>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Consultorio</Text>
                  <Text style={styles.infoVal}>{doc.room}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Precio</Text>
                  <Text style={styles.infoVal}>${doc.price}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Cupos</Text>
                  <Text style={styles.infoVal}>{doc.schedule.slotsPerDay}</Text>
                </View>
              </View>

              <View style={styles.scheduleBadge}>
                <Calendar size={14} color={COLORS.primary} />
                <Text style={styles.scheduleText}>
                  {doc.schedule.days.join(', ')} ({doc.schedule.startHour} - {doc.schedule.endHour})
                </Text>
              </View>

              {doc.phone ? (
                <TouchableOpacity
                  style={styles.callDoctorBtn}
                  onPress={() => Linking.openURL(`tel:${doc.phone}`)}
                  activeOpacity={0.8}
                >
                  <PhoneCall size={14} color="#FFF" />
                  <Text style={styles.callDoctorBtnText}>Llamar Doctor</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para Crear Doctor */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Doctor</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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

              <Text style={styles.inputLabel}>Correo</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={COLORS.primary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Especialidad</Text>
              <View style={styles.chipsRow}>
                {professions.map((p) => {
                  const isSelected = professionId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setProfessionId(p.id)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{p.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Precio ($)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Consultorio</Text>
              <TextInput
                style={styles.input}
                value={room}
                onChangeText={setRoom}
              />

              <Text style={styles.inputLabel}>Días</Text>
              <View style={styles.chipsRow}>
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = selectedDays.includes(d);
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => toggleDay(d)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <View style={{ flex: 1.1 }}>
                  <Text style={styles.inputLabel}>Hora Inicio</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setTimePickerTarget('start')}
                    activeOpacity={0.7}
                  >
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timePickerButtonText}>{startHour}</Text>
                    <ChevronDown size={14} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1.1 }}>
                  <Text style={styles.inputLabel}>Hora Fin</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setTimePickerTarget('end')}
                    activeOpacity={0.7}
                  >
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.timePickerButtonText}>{endHour}</Text>
                    <ChevronDown size={14} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.9 }}>
                  <Text style={styles.inputLabel}>Cupos</Text>
                  <TextInput
                    style={styles.input}
                    value={slotsPerDay}
                    onChangeText={setSlotsPerDay}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleCreateDoctor}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal HUD para Selector de Hora (Formato 12 Horas) */}
      <Modal visible={timePickerTarget !== null} animationType="fade" transparent>
        <View style={styles.timeModalOverlay}>
          <View style={styles.timeModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {timePickerTarget === 'start' ? 'Hora de Inicio (12h)' : 'Hora de Fin (12h)'}
              </Text>
              <TouchableOpacity onPress={() => setTimePickerTarget(null)}>
                <X size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.timeGrid} showsVerticalScrollIndicator={false}>
              {TIME_OPTIONS.map((timeStr) => {
                const isSelected = (timePickerTarget === 'start' ? startHour : endHour) === timeStr;
                return (
                  <TouchableOpacity
                    key={timeStr}
                    style={[styles.timeSlotChip, isSelected && styles.timeSlotChipActive]}
                    onPress={() => {
                      if (timePickerTarget === 'start') {
                        setStartHour(timeStr);
                      } else {
                        setEndHour(timeStr);
                      }
                      setTimePickerTarget(null);
                    }}
                  >
                    <Clock size={14} color={isSelected ? '#FFF' : COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextActive]}>
                      {timeStr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 12 },
  emptySubtext: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  doctorCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(13,110,253,0.1)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  doctorName: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  doctorSpec: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  doctorEmail: { fontSize: 12, color: COLORS.textSecondary },
  deleteButton: { padding: 8 },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textSecondary },
  infoVal: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginTop: 2 },
  scheduleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', padding: 8, borderRadius: 8, gap: 6 },
  scheduleText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  modalError: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 12 },
  modalErrorText: { color: '#991B1B', fontSize: 13, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: COLORS.text, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.text },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 20 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  timePickerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  timeModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: SPACING.lg,
    width: '100%',
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  timeSlotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '45%',
    justifyContent: 'center',
  },
  timeSlotChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  timeSlotTextActive: {
    color: '#FFF',
  },
  doctorPhone: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  callDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 10,
  },
  callDoctorBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
