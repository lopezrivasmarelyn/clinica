import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Afiliado } from '../services/api';

type AppMode = 'patient' | 'clinic';

interface AppContextData {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  user: Afiliado | null;
  setUser: (user: Afiliado | null) => Promise<void>;
  logout: () => Promise<void>;
  cargandoSesion: boolean;
}

const AppContext = createContext<AppContextData>({
  mode: 'patient',
  setMode: () => {},
  seniorMode: false,
  setSeniorMode: () => {},
  user: null,
  setUser: async () => {},
  logout: async () => {},
  cargandoSesion: true,
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('patient');
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [user, setUserState] = useState<Afiliado | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState<boolean>(true);

  // Al abrir la app, leemos el teléfono para ver si ya había un usuario logueado
  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const sesionGuardada = await AsyncStorage.getItem('@sesion_usuario');
        if (sesionGuardada) {
          setUserState(JSON.parse(sesionGuardada));
        }
      } catch (error) {
        console.error('Error al recuperar la sesión:', error);
      } finally {
        setCargandoSesion(false);
      }
    };

    recuperarSesion();
  }, []);

  // Función para guardar o borrar la sesión en el disco
  const setUser = async (nuevoUsuario: Afiliado | null) => {
    setUserState(nuevoUsuario);
    if (nuevoUsuario) {
      await AsyncStorage.setItem('@sesion_usuario', JSON.stringify(nuevoUsuario));
    } else {
      await AsyncStorage.removeItem('@sesion_usuario');
    }
  };

  const logout = async () => {
    await setUser(null);
  };

  return (
      <AppContext.Provider value={{
        mode,
        setMode,
        seniorMode,
        setSeniorMode,
        user,
        setUser,
        logout,
        cargandoSesion
      }}>
        {children}
      </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);