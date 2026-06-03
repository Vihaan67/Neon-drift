import React, { createContext, useContext, useState } from 'react';

const EnvironmentContext = createContext();

export function EnvironmentProvider({ children }) {
  const [isNight, setIsNight] = useState(false);

  const toggleDayNight = () => setIsNight(prev => !prev);

  return (
    <EnvironmentContext.Provider value={{ isNight, toggleDayNight }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
