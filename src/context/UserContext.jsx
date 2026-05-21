import { createContext, useState, useEffect, useCallback } from 'react';
import { issueService } from '../services/issueService';

export const USERS = [
  { id: 4, name: "Sergi",   apiKey: "d2a157a572db39ed25cc9ffea7ee1b12" },
  { id: 2, name: "Victor",  apiKey: "a965d68e049cb45e49386312fa7a83b6" },
  { id: 5, name: "Claudia", apiKey: "8135aea2ddebc220d40bad00212fdf35" },
  { id: 3, name: "Adria",   apiKey: "TU_API_KEY_AQUI_4" }
];

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  const [statuses,          setStatuses]          = useState([]);
  const [issueTypes,        setIssueTypes]        = useState([]);
  const [priorities,        setPriorities]        = useState([]);
  const [severities,        setSeverities]        = useState([]);
  const [tags,              setTags]              = useState([]);
  const [deadlineShortcuts, setDeadlineShortcuts] = useState([]);

  // carrega tots els atributs de configuració d'un cop
  const loadConfigData = useCallback(async (apiKey) => {
    try {
      const [stData, itData, prData, svData, tgData, dsData] = await Promise.all([
        issueService.getStatuses(apiKey),
        issueService.getIssueTypes(apiKey),
        issueService.getPriorities(apiKey),
        issueService.getSeverities(apiKey),
        issueService.getTags(apiKey).catch(() => []),
        issueService.getDeadlineShortcuts(apiKey).catch(() => [])
      ]);
      setStatuses(stData);
      setIssueTypes(itData);
      setPriorities(prData);
      setSeverities(svData);
      setTags(tgData);
      setDeadlineShortcuts(dsData);
    } catch (err) {
      console.error("Error carregant atributs dinàmics", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.apiKey) {
      loadConfigData(currentUser.apiKey);
    }
  }, [currentUser, loadConfigData]);

  // funcions de refresc individuals per usar des del SettingsPanel
  const refreshStatuses          = () => issueService.getStatuses(currentUser.apiKey).then(setStatuses);
  const refreshIssueTypes        = () => issueService.getIssueTypes(currentUser.apiKey).then(setIssueTypes);
  const refreshPriorities        = () => issueService.getPriorities(currentUser.apiKey).then(setPriorities);
  const refreshSeverities        = () => issueService.getSeverities(currentUser.apiKey).then(setSeverities);
  const refreshTags              = () => issueService.getTags(currentUser.apiKey).then(setTags);
  const refreshDeadlineShortcuts = () => issueService.getDeadlineShortcuts(currentUser.apiKey).then(setDeadlineShortcuts);

  const getUserNameById = (id) => {
    if (!id) return "Sense assignar";
    const user = USERS.find(u => u.id === parseInt(id));
    return user ? user.name : "Usuari extern";
  };

  return (
    <UserContext.Provider value={{
      currentUser, setCurrentUser, USERS, getUserNameById,
      statuses,          setStatuses,          refreshStatuses,
      issueTypes,        setIssueTypes,        refreshIssueTypes,
      priorities,        setPriorities,        refreshPriorities,
      severities,        setSeverities,        refreshSeverities,
      tags,              setTags,              refreshTags,
      deadlineShortcuts, setDeadlineShortcuts, refreshDeadlineShortcuts
    }}>
      {children}
    </UserContext.Provider>
  );
};
