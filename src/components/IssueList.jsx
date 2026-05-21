import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueList({ onNavigateToBulk, onNavigateToCreate, onViewDetail, onNavigateToSettings }) {
  const { currentUser, setCurrentUser, USERS, getUserNameById, statuses, issueTypes, priorities, severities } = useContext(UserContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({ 
    query: '', sort: 'id', direction: 'desc',
    type: '', status: '', priority: '', severity: ''    
  });

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getAll(currentUser.apiKey, filters);
      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error carregant incidències", error);
    } finally {
      setLoading(false);
    }
  };

  const getName = (list, id) => list.find(item => item.id === id)?.name || "-";

  useEffect(() => {
    fetchIssues();
  }, [currentUser, filters.query, filters.sort, filters.direction, filters.type, filters.status, filters.priority, filters.severity]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const getStatusName = (statusId) => {
    const st = statuses.find(s => s.id === statusId);
    return st ? st.name : "New";
  };

  return (
    <div className="panel" style={{ padding: '30px' }}>
      <header className="header-main">
        <h2 style={{ fontSize: '28px', margin: 0, color: '#333' }}>Incidències</h2>
        <div className="user-selector" style={{ background: '#f0f0f0' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666' }}>Actiu com:</label>
          <select 
            value={currentUser.id} 
            onChange={(e) => {
              const selectedUser = USERS.find(u => u.id === parseInt(e.target.value));
              setCurrentUser(selectedUser);
            }}
            style={{ border: 'none', background: 'transparent', fontWeight: 'bold', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
          >
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="actions-bar" style={{ margin: 0 }}>
            <button onClick={onNavigateToCreate} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>+ NOVA INCIDÈNCIA</button>
            <button onClick={onNavigateToBulk} className="btn btn-neutral" style={{ padding: '12px 24px', fontSize: '15px', marginLeft: '10px' }}>INSERCIÓ MASSIVA</button>
            <button onClick={onNavigateToSettings} className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '15px', marginLeft: '10px' }}>⚙️ Configuració</button>
          </div>

          <form onSubmit={handleSearch} style={{ margin: 0, display: 'flex', gap: '10px' }}>
            <input 
              type="text" placeholder="Cercar al subject..." value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              style={{ width: '300px', borderRadius: '4px', padding: '10px 15px', border: '1px solid #ccc' }}
            />
          </form>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #eee' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Tipus:</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} style={{ padding: '6px' }}>
              <option value="">Tots</option>
              {issueTypes.map(it => (
                <option key={it.id} value={it.name}>{it.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Estat:</label>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} style={{ padding: '6px' }}>
              <option value="">Tots</option>
              {statuses.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Prioritat:</label>
            <select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} style={{ padding: '6px' }}>
              <option value="">Totes</option>
              {priorities.map(pr => (
                <option key={pr.id} value={pr.name}>{pr.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Severitat:</label>
            <select value={filters.severity} onChange={(e) => setFilters({...filters, severity: e.target.value})} style={{ padding: '6px' }}>
              <option value="">Totes</option>
              {severities.map(sv => (
                <option key={sv.id} value={sv.name}>{sv.name}</option>
              ))}
            </select>
          </div>

          <div style={{ borderLeft: '2px solid #ddd', margin: '0 10px' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ordenar per:</label>
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} style={{ padding: '6px' }}>
              <option value="id">ID</option>
              <option value="type">Tipus</option>
              <option value="severity">Severitat</option>
              <option value="priority">Prioritat</option>
              <option value="deadline">Data Límit</option>
              <option value="status">Estat</option>
              <option value="creator">Creador</option>
              <option value="assignee">Assignat</option>
            </select>

            <select value={filters.direction} onChange={(e) => setFilters({ ...filters, direction: e.target.value })} style={{ padding: '6px' }}>
              <option value="desc">Descendent</option>
              <option value="asc">Ascendent</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '60px', color: '#888'}}>Carregant dades...</div>
      ) : (
        <table className="taiga-table" style={{ boxShadow: 'none', border: '1px solid #eaeaea', width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ width: '50px', textAlign: 'center', padding: '10px', borderBottom: '2px solid #eee' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Assumpte</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Estat</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Tipus</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Prioritat</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Severitat</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Deadline</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Creador</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #eee' }}>Assignat</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue.id || `issue-${index}`} style={{ cursor: 'default' }}>
                <td style={{ textAlign: 'center', color: '#888', padding: '10px', borderBottom: '1px solid #eee' }}>#{issue.id || index}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span 
                    onClick={() => onViewDetail(issue.id)} 
                    style={{ fontWeight: '600', color: 'var(--primary)', cursor: 'pointer' }}
                  >
                    {issue.subject}
                  </span>
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getName(statuses, issue.status_id)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getName(issueTypes, issue.issue_type_id)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getName(priorities, issue.priority_id)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getName(severities, issue.severity_id)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getUserNameById(issue.user_id)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{getUserNameById(issue.assigned_to_id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}