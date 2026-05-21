import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';
import { MAPPINGS } from '../utils/constants';

export default function IssueDetail({ issueId, onBack, onEdit, onShowNotification }) {
  const { currentUser, USERS } = useContext(UserContext);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await issueService.getById(currentUser.apiKey, issueId);
        setIssue(data);
      } catch (error) {
        onShowNotification("Error carregant detall.", "error");
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [issueId, currentUser.apiKey, onBack, onShowNotification]);

  const handleDelete = async () => {
    if (!window.confirm("N'estàs segur que vols eliminar aquesta incidència?")) return;
    try {
      await issueService.delete(currentUser.apiKey, issueId);
      onShowNotification("Incidència eliminada correctament", "success");
      onBack();
    } catch (error) {
      onShowNotification("Error a l'eliminar la incidència.", "error");
    }
  };

  const handleAssign = async (e) => {
    // Capturamos el valor como string tal cual viene del select
    const selectedValue = e.target.value;
    // Si está vacío enviamos null, si tiene valor lo enviamos como string (si tu API usa UUIDs) o número
    const newAssigneeId = selectedValue === "" ? null : selectedValue;
    
    try {
      // IMPORTANTE: Construimos el objeto completo para que el PUT sea un reemplazo válido 
      // según tu api.yml
      const payload = {
        subject: issue.subject,
        description: issue.description || "",
        status_id: parseInt(issue.status_id),
        priority_id: parseInt(issue.priority_id),
        severity_id: parseInt(issue.severity_id),
        issue_type_id: parseInt(issue.issue_type_id),
        assigned_to_id: newAssigneeId
      };

      if (issue.deadline) payload.deadline = issue.deadline;

      const updatedIssue = await issueService.update(currentUser.apiKey, issueId, payload);
      setIssue(updatedIssue);
      onShowNotification("Assignació actualitzada", "success");
    } catch (error) {
      console.error("Error al asignar:", error);
      onShowNotification("Error canviant assignació.", "error");
    }
  };

<select 
  value={issue.assigned_to_id || ""} 
  onChange={handleAssign} 
  style={{ width: '100%', padding: '8px' }}
>
  <option value="">Sense assignar</option>
  {USERS.map((u, index) => (
    <option key={u.backendId || `user-${index}`} value={u.backendId}>
      {u.name}
    </option>
  ))}
</select>

  if (loading) return <div className="panel" style={{textAlign: 'center', padding: '50px'}}>Carregant detall...</div>;
  if (!issue) return null;

  return (
    <div className="panel" style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
      <div className="detail-header" style={{ marginBottom: '30px' }}>
        <div className="detail-title-block">
          <span className="detail-id">#{issue.id}</span>
          <h2 className="detail-subject">{issue.subject}</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(issue)} className="btn btn-neutral">Editar</button>
          <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
          <button onClick={onBack} className="btn btn-secondary">Tornar</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="description-panel panel" style={{boxShadow: 'none', border: '1px solid #eee'}}>
          <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '13px' }}>Descripció</h4>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
            {issue.description || <em style={{color: '#aaa'}}>Sense descripció ampliada...</em>}
          </p>
        </div>

        <div className="sidebar-panel" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '6px', border: '1px solid #eee', alignSelf: 'start' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px', marginTop: 0 }}>
            Atributs
          </h4>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Assignat a</span>
            <select value={issue.assigned_to_id || ""} onChange={handleAssign} style={{ width: '100%' }}>
              <option value="">Sense assignar</option>
              {USERS.map((u, index) => (
                /* Añadimos el index al key como salvavidas */
                <option key={u.backendId || `user-${index}`} value={u.backendId}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="meta-item">
            <span className="meta-label">Tipus:</span>
            <span style={{fontWeight: '500'}}>{MAPPINGS.issue_type[issue.issue_type_id] || "Desconegut"}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Estat:</span>
            <span style={{fontWeight: '500', background: '#e4e6ea', padding: '2px 8px', borderRadius: '10px', fontSize: '12px'}}>
              {MAPPINGS.status[issue.status_id] || "Nou"}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Prioritat:</span>
            <span>{MAPPINGS.priority[issue.priority_id] || "Normal"}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Severitat:</span>
            <span>{MAPPINGS.severity[issue.severity_id] || "Normal"}</span>
          </div>

          <div className="meta-item" style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '15px' }}>
            <span className="meta-label">Data Límit:</span>
            <span style={{ color: issue.deadline ? '#333' : '#aaa' }}>
              {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "Sense especificar"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}