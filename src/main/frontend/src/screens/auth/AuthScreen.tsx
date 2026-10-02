import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, User, Phone, Activity } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';
import { useAppContext } from '../../context/AppContext';

export const AuthScreen = () => {
  const { login, register, seniorMode } = useAppContext();
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll helper when keyboard opens
  const scrollToField = (yOffset: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }, 120);
  };

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Feedback message
  const [errorMessage, setErrorMessage] = useState('');

  // Handle phone input strictly limited to 8 digits
  const handlePhoneChange = (text: string) => {
    // Keep only numbers and max 8 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 8);
    setPhone(cleaned);
  };

  const handleLoginSubmit = async () => {
    setErrorMessage('');
    const res = await login(loginEmail, loginPassword);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleRegisterSubmit = async () => {
    setErrorMessage('');
    if (!firstName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Por favor ingresa tu apellido.');
      return;
    }
    if (phone.length !== 8) {
      setErrorMessage('El teléfono debe tener exactamente 8 dígitos.');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }
    if (!registerPassword.trim() || registerPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const res = await register({
      firstName,
      lastName,
      phone,
      email: registerEmail,
      password: registerPassword,
    });

    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo y Encabezado de la App */}
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <Activity size={32} color="#FFF" />
              </View>
              <Text style={[styles.brandTitle, seniorMode && styles.seniorBrandTitle]}>
                SGC
              </Text>
            </View>

            {/* Selector de Modo: Iniciar Sesión / Crear Cuenta */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, authMode === 'login' && styles.activeTabButton]}
                onPress={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                }}
              >
                <Text style={[styles.tabText, authMode === 'login' && styles.activeTabText]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, authMode === 'register' && styles.activeTabButton]}
                onPress={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                }}
              >
                <Text style={[styles.tabText, authMode === 'register' && styles.activeTabText]}>
                  Crear Cuenta
                </Text>
              </TouchableOpacity>
            </View>

            {/* Banner de Error si aplica */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Formulario: Iniciar Sesión */}
            {authMode === 'login' && (
              <View style={styles.card}>
                {/* Correo */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={loginEmail}
                      onChangeText={setLoginEmail}
                    />
                  </View>
                </View>

                {/* Contraseña con Ojito */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      secureTextEntry={!showLoginPassword}
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                      onFocus={() => scrollToField(140)}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowLoginPassword(!showLoginPassword)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      {showLoginPassword ? (
                        <EyeOff size={22} color={COLORS.primary} />
                      ) : (
                        <Eye size={22} color={COLORS.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón Principal */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleLoginSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                {/* Link de alternancia */}
                <TouchableOpacity
                  style={styles.switchLink}
                  onPress={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                  }}
                >
                  <Text style={styles.switchLinkText}>
                    ¿No tienes cuenta? <Text style={styles.switchLinkBold}>Regístrate</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Formulario: Crear Cuenta */}
            {authMode === 'register' && (
              <View style={styles.card}>
                {/* Nombre */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre</Text>
                  <View style={styles.inputWrapper}>
                    <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>

                {/* Apellido */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Apellido</Text>
                  <View style={styles.inputWrapper}>
                    <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                {/* Teléfono */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={8}
                      value={phone}
                      onChangeText={handlePhoneChange}
                      onFocus={() => scrollToField(120)}
                    />
                  </View>
                </View>

                {/* Correo */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                      onFocus={() => scrollToField(180)}
                    />
                  </View>
                </View>

                {/* Contraseña con Ojito */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      secureTextEntry={!showRegisterPassword}
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                      onFocus={() => scrollToField(260)}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={22} color={COLORS.primary} />
                      ) : (
                        <Eye size={22} color={COLORS.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleRegisterSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
                </TouchableOpacity>

                {/* Link de alternancia */}
                <TouchableOpacity
                  style={styles.switchLink}
                  onPress={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                >
                  <Text style={styles.switchLinkText}>
                    ¿Ya tienes cuenta? <Text style={styles.switchLinkBold}>Inicia sesión</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 240,
    flexGrow: 1,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  seniorBrandTitle: {
    fontSize: 34,
  },
  brandSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  seniorBrandSubtitle: {
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    borderColor: '#F8B4B4',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: '#9B1C1C',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchLinkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
