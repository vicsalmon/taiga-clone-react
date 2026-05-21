import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';
import { MAPPINGS } from '../utils/constants';

export default function IssueList({ onNavigateToBulk, onNavigateToCreate, onViewDetail }) {
  const { currentUser, setCurrentUser, USERS, getUserNameById } = useContext(UserContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ query: '', sort: 'created_at', direction: 'desc' });

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getAll(currentUser.apiKey, filters);
      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Error de connexió.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [currentUser, filters.sort, filters.direction]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="panel" style={{ padding: '30px' }}>
      <header className="header-main">
        <h2 style={{ fontSize: '28px', margin: 0, color: '#333' }}>Incidències</h2>
        <div className="user-selector" style={{ background: '#f0f0f0' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666' }}>Actiu com:</label>
          <select 
            value={currentUser.backendId} 
            onChange={(e) => {
              const selectedUser = USERS.find(u => u.backendId === e.target.value);
              setCurrentUser(selectedUser);
            }}
            style={{ border: 'none', background: 'transparent', fontWeight: 'bold', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
          >
            {USERS.map((u, index) => (
              <option key={u.backendId || index} value={u.backendId}>{u.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div style={{display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '30px', alignItems: 'center'}}>
        <div className="actions-bar" style={{margin: 0}}>
          <button onClick={onNavigateToCreate} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>+ NOVA INCIDÈNCIA</button>
          <button onClick={onNavigateToBulk} className="btn btn-neutral" style={{ padding: '12px 24px', fontSize: '15px' }}>INSERCIÓ MASSIVA</button>
        </div>

        <form onSubmit={handleSearch} className="search-bar" style={{margin: 0, flex: 1, justifyContent: 'flex-end'}}>
          <input 
            type="text" 
            placeholder="Cercar..." 
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            style={{maxWidth: '300px', borderRadius: '20px', padding: '10px 20px'}}
          />
        </form>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '60px', color: '#888'}}>Carregant dades...</div>
      ) : (
        <table className="taiga-table" style={{ boxShadow: 'none', border: '1px solid #eaeaea' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ width: '80px', textAlign: 'center' }}>ID</th>
              <th>Assumpte</th>
              <th style={{ width: '150px' }}>Estat</th>
              <th style={{ width: '200px' }}>Assignat a</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue.id || `issue-${index}`} style={{ cursor: 'default' }}>
                <td style={{ textAlign: 'center', color: '#888', fontWeight: '500' }}>#{issue.id || index}</td>
                <td>
                  <span 
                    onClick={() => onViewDetail(issue.id)} 
                    style={{ fontWeight: '600', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none', fontSize: '15px' }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    {issue.subject}
                  </span>
                </td>
                <td>
                  <span style={{background: '#f0f0f0', color: '#555', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: '600'}}>
                    {MAPPINGS.status[issue.status_id] || "Nou"}
                  </span>
                </td>
                <td style={{ color: issue.assigned_to_id ? '#333' : '#aaa', fontSize: '14px' }}>
                  {getUserNameById(issue.assigned_to_id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}