import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  patientCode?: string;
  doctorId?: string;
}

export interface Profession {
  id: string;
  name: string;
  description: string;
}

export interface DoctorSchedule {
  days: string[];
  startHour: string;
  endHour: string;
  slotsPerDay: number;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  professionId: string;
  professionName: string;
  price: number;
  room: string;
  schedule: DoctorSchedule;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  professionName: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface AppContextData {
  user: UserProfile | null;
  isLoadingAuth: boolean;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { firstName: string; lastName: string; phone: string; email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  // Professions
  professions: Profession[];
  addProfession: (name: string, description: string) => Promise<void>;
  deleteProfession: (id: string) => Promise<void>;
  // Doctors
  doctors: Doctor[];
  addDoctor: (doc: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    professionId: string;
    price: number;
    room: string;
    schedule: DoctorSchedule;
  }) => Promise<{ success: boolean; error?: string }>;
  updateDoctor: (id: string, updated: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  // Appointments
  appointments: Appointment[];
  bookAppointment: (data: {
    doctorId: string;
    date: string;
    time: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateAppointmentStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
}

const STORAGE_KEY_USER = '@sgc_user_session';
const STORAGE_KEY_SENIOR = '@sgc_senior_mode';

const DEFAULT_ADMIN: UserProfile = {
  id: 'admin_principal',
  name: 'Administrador del Sistema',
  email: 'admin@sgc.med',
  role: 'admin',
};

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [seniorMode, setSeniorModeState] = useState<boolean>(false);

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const setSeniorMode = async (val: boolean) => {
    setSeniorModeState(val);
    await AsyncStorage.setItem(STORAGE_KEY_SENIOR, JSON.stringify(val));
  };

  // 1. Cargar sesión local guardada
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        const storedSenior = await AsyncStorage.getItem(STORAGE_KEY_SENIOR);
        if (storedSenior) {
          setSeniorModeState(JSON.parse(storedSenior));
        }
      } catch (err) {
        console.error('Error cargando sesión local:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    loadSession();
  }, []);

  // 2. Suscripción en tiempo real a Firebase Firestore
  useEffect(() => {
    // Escuchar Categorías / Especialidades
    const unsubCats = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const list: Profession[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            name: data.name || '',
            description: data.description || '',
          });
        });
        setProfessions(list);
      },
      (err) => console.error('Error en snapshot de categories:', err)
    );

    // Escuchar Doctores
    const unsubDocs = onSnapshot(
      collection(db, 'doctors'),
      (snapshot) => {
        const list: Doctor[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            userId: data.userId || `user_${d.id}`,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            professionId: data.categoryId || data.professionId || '',
            professionName: data.specialty || data.professionName || 'Medicina General',
            price: Number(data.consultationPrice ?? data.price ?? 0),
            room: data.room || 'Consultorio',
            schedule: data.schedule || {
              days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
              startHour: '09:00 AM',
              endHour: '05:00 PM',
              slotsPerDay: 8,
            },
          });
        });
        setDoctors(list);
      },
      (err) => console.error('Error en snapshot de doctors:', err)
    );

    // Escuchar Citas
    const unsubAppts = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        const list: Appointment[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          let statusVal: Appointment['status'] = 'pending';
          if (data.status === 'confirmed') statusVal = 'confirmed';
          else if (data.status === 'completed') statusVal = 'completed';
          else if (data.status === 'cancelled') statusVal = 'cancelled';
          else statusVal = 'pending';

          let createdAtStr = new Date().toISOString();
          if (data.createdAt?.toDate) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === 'string') {
            createdAtStr = data.createdAt;
          }

          list.push({
            id: d.id,
            patientId: data.patientId || '',
            patientName: data.patientName || '',
            patientPhone: data.patientPhone || '',
            doctorId: data.doctorId || '',
            doctorName: data.doctorName || '',
            professionName: data.specialty || data.professionName || '',
            date: data.date || data.dateLabel || format(new Date(), 'yyyy-MM-dd'),
            time: data.time || data.timeLabel || '10:00 AM',
            price: Number(data.cost ?? data.price ?? 0),
            status: statusVal,
            createdAt: createdAtStr,
          });
        });
        setAppointments(list);
      },
      (err) => console.error('Error en snapshot de appointments:', err)
    );

    return () => {
      unsubCats();
      unsubDocs();
      unsubAppts();
    };
  }, []);

  // 3. Inicio de sesión conectado a Firestore
  const login = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanPass) {
        return { success: false, error: 'Ingresa correo y contraseña.' };
      }

      // Verificación directa para Administrador
      if (cleanEmail === 'admin@sgc.med' && cleanPass === 'admin123') {
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_ADMIN));
        setUser(DEFAULT_ADMIN);
        return { success: true };
      }

      // Buscar usuario en Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      if (snap.empty) {
        return { success: false, error: 'Usuario no encontrado.' };
      }

      const userDoc = snap.docs[0];
      const userData = userDoc.data();

      if (userData.password && userData.password !== cleanPass) {
        return { success: false, error: 'Contraseña incorrecta.' };
      }

      const loggedUser: UserProfile = {
        id: userDoc.id,
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Usuario',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: (userData.role as UserRole) || 'patient',
        patientCode: userData.patientCode,
        doctorId: userData.doctorId,
      };

      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true };
    } catch (e: any) {
      console.error('Error al iniciar sesión:', e);
      return { success: false, error: e.message || 'Error al iniciar sesión.' };
    }
  };

  // 4. Registro de Paciente en Firestore
  const register = async (data: { firstName: string; lastName: string; phone: string; email: string; password?: string }) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();

      // Verificar si ya existe en Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { success: false, error: 'Ya existe una cuenta con este correo.' };
      }

      const userId = 'user_patient_' + Date.now();
      const patientCode = `P-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUserData = {
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        password: data.password || '',
        role: 'patient',
        patientCode,
        active: true,
        createdAt: serverTimestamp(),
      };

      // Guardar en Firestore directamente
      await setDoc(doc(db, 'users', userId), newUserData);

      const newUserProfile: UserProfile = {
        id: userId,
        name: newUserData.name,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: cleanEmail,
        phone: newUserData.phone,
        role: 'patient',
        patientCode,
      };

      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUserProfile));
      setUser(newUserProfile);
      return { success: true };
    } catch (e: any) {
      console.error('Error al registrar paciente:', e);
      return { success: false, error: e.message || 'Error al registrar.' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
  };

  // 5. Especialidades en Firestore
  const addProfession = async (name: string, description: string) => {
    try {
      const catId = 'cat_' + Date.now();
      await setDoc(doc(db, 'categories', catId), {
        name: name.trim(),
        description: description.trim(),
        active: true,
      });
    } catch (e) {
      console.error('Error al crear especialidad:', e);
    }
  };

  const deleteProfession = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error('Error al eliminar especialidad:', e);
    }
  };

  // 6. Doctores en Firestore (guarda en 'doctors' y en 'users')
  const addDoctor = async (docData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    professionId: string;
    price: number;
    room: string;
    schedule: DoctorSchedule;
  }) => {
    try {
      const cleanEmail = docData.email.trim().toLowerCase();
      const docId = 'doc_' + Date.now();
      const userId = 'user_' + docId;
      const prof = professions.find((p) => p.id === docData.professionId);
      const profName = prof ? prof.name : 'Medicina General';

      // Guardar en colección 'doctors'
      await setDoc(doc(db, 'doctors', docId), {
        id: docId,
        userId,
        name: docData.name.trim(),
        email: cleanEmail,
        phone: docData.phone ? docData.phone.trim() : '',
        specialty: profName,
        professionName: profName,
        categoryId: docData.professionId,
        consultationPrice: docData.price,
        price: docData.price,
        room: docData.room.trim() || 'Consultorio',
        schedule: docData.schedule,
        active: true,
        createdAt: serverTimestamp(),
      });

      // Guardar en colección 'users' para login del doctor
      await setDoc(doc(db, 'users', userId), {
        name: docData.name.trim(),
        email: cleanEmail,
        phone: docData.phone ? docData.phone.trim() : '',
        password: docData.password.trim(),
        role: 'doctor',
        doctorId: docId,
        active: true,
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (e: any) {
      console.error('Error al agregar doctor:', e);
      return { success: false, error: e.message || 'Error al crear doctor.' };
    }
  };

  const updateDoctor = async (id: string, updatedFields: Partial<Doctor>) => {
    try {
      await updateDoc(doc(db, 'doctors', id), {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error al actualizar doctor:', e);
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      await deleteDoc(doc(db, 'users', 'user_' + id));
    } catch (e) {
      console.error('Error al eliminar doctor:', e);
    }
  };

  // 7. Citas en Firestore
  const bookAppointment = async (data: { doctorId: string; date: string; time: string }) => {
    try {
      if (!user) return { success: false, error: 'Debes iniciar sesión.' };

      const docObj = doctors.find((d) => d.id === data.doctorId);
      if (!docObj) return { success: false, error: 'Doctor no encontrado.' };

      const apptId = 'appt_' + Date.now();
      await setDoc(doc(db, 'appointments', apptId), {
        patientId: user.id,
        patientName: user.name,
        patientPhone: user.phone || '',
        doctorId: docObj.id,
        doctorName: docObj.name,
        specialty: docObj.professionName,
        professionName: docObj.professionName,
        date: data.date,
        dateLabel: data.date,
        time: data.time,
        timeLabel: data.time,
        cost: docObj.price,
        price: docObj.price,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (e: any) {
      console.error('Error al agendar cita:', e);
      return { success: false, error: e.message || 'Error al agendar cita.' };
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error al actualizar cita:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoadingAuth,
        seniorMode,
        setSeniorMode,
        login,
        register,
        logout,
        professions,
        addProfession,
        deleteProfession,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
