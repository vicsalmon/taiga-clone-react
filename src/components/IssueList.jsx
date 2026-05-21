import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueList({ onNavigateToBulk, onNavigateToCreate, onViewDetail }) {
  // 1. Extraemos el usuario actual y la lista de usuarios del Contexto
  const { currentUser, setCurrentUser, USERS } = useContext(UserContext);
  
  // 2. Estados locales para guardar las issues y los filtros
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    sort: 'created_at',
    direction: 'desc'
  });

  // 3. Función que llama al Backend. Se ejecuta al cargar la página o al cambiar de usuario/filtros.
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getAll(currentUser.apiKey, filters);
      setIssues(data);
    } catch (error) {
      console.error("Error cargando issues:", error);
      alert("Hubo un error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  // useEffect "escucha" si cambia el usuario o el orden, y vuelve a pedir los datos a la API
  useEffect(() => {
    fetchIssues();
  }, [currentUser, filters.sort, filters.direction]);

  // Manejador para el buscador (se ejecuta al darle a Enter o al botón "Buscar")
  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER: EL DROPDOWN DE USUARIOS (Requisito del profesor) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
        <h2>Taiga Clone - Tauler d'Incidències</h2>
        <div>
          <label style={{ marginRight: '10px' }}>👤 Usuari actiu:</label>
          <select 
            value={currentUser.id} 
            onChange={(e) => {
              const selectedUser = USERS.find(u => u.id === parseInt(e.target.value));
              setCurrentUser(selectedUser);
            }}
            style={{ padding: '5px' }}
          >
            {USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* BARRA DE BÚSQUEDA Y ORDENACIÓN */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Cercar per text (subject)..." 
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          style={{ padding: '5px', flex: 1 }}
        />
        
        <select 
          value={filters.sort} 
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          style={{ padding: '5px' }}
        >
          <option value="created_at">Data de creació</option>
          <option value="id">ID</option>
          <option value="priority">Prioritat</option>
          <option value="severity">Severitat</option>
        </select>

        <select 
          value={filters.direction} 
          onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
          style={{ padding: '5px' }}
        >
          <option value="desc">Descendent</option>
          <option value="asc">Ascendent</option>
        </select>

        <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>Cercar</button>
      </form>

      {/* ACCIONES RÁPIDAS */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={onNavigateToCreate}
          style={{ marginRight: '10px', background: '#00b19d', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
        >
          + Crear Issue
        </button>
        <button 
          onClick={onNavigateToBulk}
          style={{ background: '#222', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
        >
          ⚡ Bulk Insert
        </button>
      </div>

      {/* LISTA DE INCIDENCIAS */}
      {loading ? (
        <p>Carregant incidències...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th># ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Assignat a</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 0' }}>{issue.id}</td>
                <td>{issue.subject}</td>
                <td>{issue.status_id || 'New'}</td>
                <td>{issue.assigned_to_id ? `Usuari ${issue.assigned_to_id}` : 'Sense assignar'}</td>
                <td>
                  {/* AQUÍ ESTÁ EL CAMBIO IMPORTANTE 👇 */}
                  <button onClick={() => onViewDetail(issue.id)} style={{ cursor: 'pointer' }}>
                    Veure Detall
                  </button>
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No s'han trobat incidències.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}