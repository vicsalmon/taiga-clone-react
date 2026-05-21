import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueDetail({ issueId, onBack, onEdit }) {
  const { currentUser, USERS } = useContext(UserContext);
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar los detalles al entrar
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await issueService.getById(currentUser.apiKey, issueId);
        setIssue(data);
      } catch (error) {
        console.error(error);
        alert("Error al carregar els detalls de la incidència.");
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [issueId, currentUser.apiKey, onBack]);

  // Manejar el borrado
  const handleDelete = async () => {
    const confirm = window.confirm("N'estàs segur que vols eliminar aquesta incidència? Aquesta acció no es pot desfer.");
    if (!confirm) return;

    try {
      await issueService.delete(currentUser.apiKey, issueId);
      alert("Incidència eliminada correctament.");
      onBack(); // Volver a la lista
    } catch (error) {
      console.error(error);
      alert("Error a l'eliminar la incidència.");
    }
  };

  // Manejar la asignación "al vuelo"
  const handleAssign = async (e) => {
    const newAssigneeId = e.target.value ? parseInt(e.target.value) : null;
    try {
      // Usamos el endpoint PUT enviando solo el campo que queremos cambiar
      const updatedIssue = await issueService.update(currentUser.apiKey, issueId, { 
        assigned_to_id: newAssigneeId 
      });
      setIssue(updatedIssue); // Actualizamos la pantalla con el nuevo dato
    } catch (error) {
      console.error(error);
      alert("Error al canviar l'assignació.");
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Carregant els detalls de la incidència #{issueId}...</p>;
  if (!issue) return null;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* HEADER Y BOTONERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>#{issue.id} - {issue.subject}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(issue)} style={{ background: '#0052cc', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
            ✏️ Editar
          </button>
          <button onClick={handleDelete} style={{ background: '#e34935', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
            🗑️ Eliminar
          </button>
          <button onClick={onBack} style={{ background: '#ccc', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
            Tornar
          </button>
        </div>
      </div>

      {/* DETALLES */}
      <div style={{ display: 'flex', gap: '40px' }}>
        
        {/* COLUMNA PRINCIPAL */}
        <div style={{ flex: 2 }}>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', minHeight: '150px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Descripció</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{issue.description || <em style={{color: '#999'}}>Sense descripció</em>}</p>
          </div>
        </div>

        {/* BARRA LATERAL (Sidebar) */}
        <div style={{ flex: 1, background: '#f4f5f7', padding: '20px', borderRadius: '5px' }}>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Assignat a:</label>
            <select 
              value={issue.assigned_to_id || ""} 
              onChange={handleAssign}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">-- Sense assignar --</option>
              {USERS.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Estat:</span> 
            <span style={{ marginLeft: '10px' }}>ID {issue.status_id || 'New'}</span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Prioritat:</span> 
            <span style={{ marginLeft: '10px' }}>ID {issue.priority_id || 'Normal'}</span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Severitat:</span> 
            <span style={{ marginLeft: '10px' }}>ID {issue.severity_id || 'Normal'}</span>
          </div>

        </div>
      </div>
    </div>
  );
}