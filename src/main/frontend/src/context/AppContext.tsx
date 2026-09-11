import React, { createContext, useState, useContext } from 'react';

type AppMode = 'patient' | 'clinic';

interface AppContextData {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextData>({
  mode: 'patient',
  setMode: () => {},
  seniorMode: false,
  setSeniorMode: () => {},
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('patient');
  const [seniorMode, setSeniorMode] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ mode, setMode, seniorMode, setSeniorMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
