import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

// Recibe onBack (para volver a la lista) y la issueToEdit (si es nula, significa que estamos CREANDO)
export default function IssueForm({ onBack, issueToEdit = null }) {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializamos el estado. Si hay issueToEdit, usamos sus datos; si no, cadena vacía.
  const [formData, setFormData] = useState({
    subject: issueToEdit?.subject || "",
    description: issueToEdit?.description || "",
    status_id: issueToEdit?.status_id || 1, // Asumimos 1 (New) por defecto
    priority_id: issueToEdit?.priority_id || 2, // Asumimos 2 (Normal)
    severity_id: issueToEdit?.severity_id || 3, // Asumimos 3 (Normal)
    issue_type_id: issueToEdit?.issue_type_id || 1, // Asumimos 1 (Bug)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError("El subject és obligatori");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (issueToEdit) {
        // MODO EDICIÓN (PUT)
        await issueService.update(currentUser.apiKey, issueToEdit.id, formData);
        alert("Incidència modificada correctament");
      } else {
        // MODO CREACIÓN (POST)
        await issueService.create(currentUser.apiKey, formData);
        alert("Incidència creada correctament");
      }
      onBack(); // Volvemos a la lista al terminar
    } catch (err) {
      console.error(err);
      setError("Ha fallat la operació. Revisa la connexió.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{issueToEdit ? `Editar Incidència #${issueToEdit.id}` : 'Crear Nova Incidència'}</h2>
        <button onClick={onBack} style={{ padding: '5px 15px', cursor: 'pointer', background: '#ccc', border: 'none' }}>
          Tornar a la llista
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Subject (Obligatori)</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Description</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', height: '100px', padding: '8px', boxSizing: 'border-box' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Status ID</label>
            <input 
              type="number" 
              value={formData.status_id}
              onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value) || 1 })}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={loading}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Priority ID</label>
            <input 
              type="number" 
              value={formData.priority_id}
              onChange={(e) => setFormData({ ...formData, priority_id: parseInt(e.target.value) || 2 })}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: loading ? '#ccc' : '#00b19d', 
            color: 'white', 
            border: 'none', 
            padding: '12px 20px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {loading ? 'Guardant...' : 'Guardar Incidència'}
        </button>
      </form>
    </div>
  );
}