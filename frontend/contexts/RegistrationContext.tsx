import React, { createContext, useContext, useState } from 'react';

interface RegistrationContextType {
  isRegistered: boolean;
  setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
    children: React.ReactNode;
  }
  

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<Props> = ({ children }) => {
  const [isRegistered, setRegistered] = useState<boolean>(false); // Assume user is not registered initially

  return (
    <RegistrationContext.Provider value={{ isRegistered, setRegistered }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
