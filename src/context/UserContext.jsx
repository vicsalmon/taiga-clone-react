import { createContext, useState } from 'react';

// Reemplaza estas keys por 3 reales de vuestra base de datos de Render
export const USERS = [
  { id: 1, name: "Usuari 1 (sergi)", apiKey: "TU_API_KEY_AQUI_1" },
  { id: 2, name: "Usuari 2 (victor)", apiKey: "TU_API_KEY_AQUI_2" },
  { id: 3, name: "Usuari 3 (claudia)", apiKey: "TU_API_KEY_AQUI_3" },
  { id: 4, name: "Usuari 3 (Adria)", apiKey: "TU_API_KEY_AQUI_4" }
];

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, USERS }}>
      {children}
    </UserContext.Provider>
  );
};