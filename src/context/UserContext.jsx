import { createContext, useState } from 'react';

// Reemplaza estas keys por 3 reales de vuestra base de datos de Render
export const USERS = [
  { id: 4, name: "Sergi", apiKey: "d2a157a572db39ed25cc9ffea7ee1b12" },
  { id: 2, name: "Victor", apiKey: "TU_API_KEY_AQUI_2" },
  { id: 5, name: "Claudia", apiKey: "TU_API_KEY_AQUI_3" },
  { id: 3, name: "Adria", apiKey: "TU_API_KEY_AQUI_4" }
];

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  // Función de ayuda para buscar el nombre de un usuario por su ID de Render
  const getUserNameById = (id) => {
    if (!id) return "Sense assignar";
    const user = USERS.find(u => u.backendId === id || u.backendId === String(id));
    return user ? user.name : "Usuari extern";
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, USERS, getUserNameById }}>
      {children}
    </UserContext.Provider>
  );
};