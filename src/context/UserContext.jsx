import { createContext, useState, useEffect } from 'react';
import { issueService } from '../services/issueService';

export const USERS = [
  { id: 4, name: "Sergi", apiKey: "d2a157a572db39ed25cc9ffea7ee1b12" },
  { id: 2, name: "Victor", apiKey: "a965d68e049cb45e49386312fa7a83b6" },
  { id: 5, name: "Claudia", apiKey: "TU_API_KEY_AQUI_3" },
  { id: 3, name: "Adria", apiKey: "TU_API_KEY_AQUI_4" }
];

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  
  const [statuses, setStatuses] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [severities, setSeverities] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.apiKey) {
      Promise.all([
        issueService.getStatuses(currentUser.apiKey),
        issueService.getIssueTypes(currentUser.apiKey),
        issueService.getPriorities(currentUser.apiKey),
        issueService.getSeverities(currentUser.apiKey)
      ]).then(([stData, itData, prData, svData]) => {
        setStatuses(stData);
        setIssueTypes(itData);
        setPriorities(prData);
        setSeverities(svData);
      }).catch(err => console.error("Error carregant atributs dinàmics", err));
    }
  }, [currentUser]);

  const getUserNameById = (id) => {
    if (!id) return "Sense assignar";
    const user = USERS.find(u => u.id === parseInt(id));
    return user ? user.name : "Usuari extern";
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, setCurrentUser, USERS, getUserNameById,
      statuses, issueTypes, priorities, severities 
    }}>
      {children}
    </UserContext.Provider>
  );
};