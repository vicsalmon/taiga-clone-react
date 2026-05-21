import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';
import { MAPPINGS } from '../utils/constants';

export default function IssueForm({ onBack, issueToEdit = null, onShowNotification }) {
  const { currentUser, USERS } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: issueToEdit?.subject || "",
    description: issueToEdit?.description || "",
    status_id: issueToEdit?.status_id || 1,
    priority_id: issueToEdit?.priority_id || 2,
    severity_id: issueToEdit?.severity_id || 2,
    issue_type_id: issueToEdit?.issue_type_id || 1,
    assigned_to_id: issueToEdit?.assigned_to_id || "", // NUEVO: Asignación
    deadline: issueToEdit?.deadline || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) { 
      onShowNotification("El subject és obligatori", "error"); 
      return; 
    }
    
    setLoading(true); 

    const payload = { ...formData };
    if (!payload.deadline) delete payload.deadline;
    if (!payload.assigned_to_id) payload.assigned_to_id = null; // Si está vacío, enviamos null

    try {
      if (issueToEdit) {
        await issueService.update(currentUser.apiKey, issueToEdit.id, payload);
        onShowNotification("Incidència modificada correctament", "success");
      } else {
        await issueService.create(currentUser.apiKey, payload);
        onShowNotification("Incidència creada correctament", "success");
      }
      onBack();
    } catch (err) {
      onShowNotification("Error al guardar la incidència", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
      <div className="detail-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', margin: 0, color: '#333' }}>
          {issueToEdit ? `Editar #${issueToEdit.id}` : 'Nova Incidència'}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onBack} className="btn btn-secondary">Cancel·lar</button>
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
            {loading ? 'Guardant...' : 'Guardar Canvis'}
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* COLUMNA PRINCIPAL (Izquierda) */}
        <div className="description-panel panel" style={{boxShadow: 'none', border: '1px solid #eee', background: '#fff', padding: '0'}}>
          <div style={{ padding: '25px' }}>
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Assumpte</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Escriu l'assumpte de la incidència..."
                required disabled={loading}
                style={{ fontSize: '18px', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Descripció</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Afegeix més detalls aquí..."
                style={{height: '300px', fontSize: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box', resize: 'vertical'}}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* BARRA LATERAL DE ATRIBUTOS (Derecha) */}
        <div className="sidebar-panel" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '6px', border: '1px solid #eee', alignSelf: 'start' }}>
          
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
            Atributs
          </h4>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Estat</span>
            <select value={formData.status_id} onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value) })} disabled={loading} style={{ width: '100%' }}>
              {Object.entries(MAPPINGS.status).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Assignat a</span>
            <select 
              value={formData.assigned_to_id || ""} 
              onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value ? parseInt(e.target.value) : null })} 
              disabled={loading} 
              style={{ width: '100%' }}
            >
              <option value="">Sense assignar</option>
              {USERS.map((u, index) => (
                <option key={u.backendId || `form-user-${index}`} value={u.backendId}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Tipus</span>
            <select value={formData.issue_type_id} onChange={(e) => setFormData({ ...formData, issue_type_id: parseInt(e.target.value) })} disabled={loading} style={{ width: '100%' }}>
              {Object.entries(MAPPINGS.issue_type).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Prioritat</span>
            <select value={formData.priority_id} onChange={(e) => setFormData({ ...formData, priority_id: parseInt(e.target.value) })} disabled={loading} style={{ width: '100%' }}>
              {Object.entries(MAPPINGS.priority).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="meta-label">Severitat</span>
            <select value={formData.severity_id} onChange={(e) => setFormData({ ...formData, severity_id: parseInt(e.target.value) })} disabled={loading} style={{ width: '100%' }}>
              {Object.entries(MAPPINGS.severity).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="meta-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: 0 }}>
            <span className="meta-label">Data Límit (Deadline)</span>
            <input 
              type="date" 
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              disabled={loading}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}