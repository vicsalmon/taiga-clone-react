import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueDetail({ issueId, onBack, onEdit }) {
  const { currentUser, USERS } = useContext(UserContext);
  
  const [issue, setIssue] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  // estat per gestionar les notificacions de la interficie
  const [feedback, setFeedback] = useState(null);

  // funcio per mostrar missatges i amagar-los automaticament
  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueData = await issueService.getById(currentUser.apiKey, issueId);
        setIssue(issueData);

        const attachmentsData = await issueService.getAttachments(currentUser.apiKey, issueId);
        setAttachments(attachmentsData);
      } catch (error) {
        console.error(error);
        showFeedback('error', 'error al carregar els detalls de la incidència.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [issueId, currentUser.apiKey]);

  const handleDelete = async () => {
    // mantenim el confirm natiu nomes per a la prevencio d'accions destructives critiques
    const confirm = window.confirm("n'estàs segur que vols eliminar aquesta incidència? aquesta acció no es pot desfer.");
    if (!confirm) return;

    try {
      await issueService.delete(currentUser.apiKey, issueId);
      showFeedback('success', 'incidència eliminada correctament.');
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      console.error(error);
      showFeedback('error', "error a l'eliminar la incidència.");
    }
  };

  const handleAssign = async (e) => {
    const newAssigneeId = e.target.value ? parseInt(e.target.value) : null;
    try {
      const updatedIssue = await issueService.update(currentUser.apiKey, issueId, { 
        assigned_to_id: newAssigneeId 
      });
      setIssue(updatedIssue);
      showFeedback('success', "assignació actualitzada correctament.");
    } catch (error) {
      console.error(error);
      showFeedback('error', "error al canviar l'assignació.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await issueService.uploadAttachment(currentUser.apiKey, issueId, file);
      const updatedAttachments = await issueService.getAttachments(currentUser.apiKey, issueId);
      setAttachments(updatedAttachments);
      e.target.value = null;
      showFeedback('success', 'fitxer pujat correctament.');
    } catch (error) {
      console.error(error);
      showFeedback('error', 'error pujant el fitxer adjunt.');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const confirm = window.confirm("vols eliminar aquest fitxer adjunt?");
    if (!confirm) return;

    try {
      await issueService.deleteAttachment(currentUser.apiKey, attachmentId);
      setAttachments(attachments.filter(att => att.id !== attachmentId));
      showFeedback('success', 'fitxer adjunt eliminat correctament.');
    } catch (error) {
      console.error(error);
      showFeedback('error', 'error eliminant el fitxer adjunt.');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>carregant els detalls de la incidència #{issueId}...</p>;
  if (!issue) return null;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* bloc de notificacions en linia */}
      {feedback && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '4px', 
          color: 'white', 
          fontWeight: 'bold',
          backgroundColor: feedback.type === 'success' ? '#00b19d' : '#e34935' 
        }}>
          {feedback.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>#{issue.id} - {issue.subject}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(issue)} style={{ background: '#0052cc', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
            ✏️ Editar
          </button>
          <button onClick={handleDelete} style={{ background: '#e34935', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
            🗑️ Eliminar
          </button>
          <button onClick={onBack} style={{ background: '#ccc', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
            Tornar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        
        <div style={{ flex: 2 }}>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', minHeight: '150px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Descripció</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{issue.description || <em style={{color: '#999'}}>Sense descripció</em>}</p>
          </div>

          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Fitxers Adjunts</h4>
            
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {attachments.map(att => (
                <li key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '10px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0052cc', wordBreak: 'break-all' }}>
                    {att.filename} ({Math.round(att.byte_size / 1024)} KB)
                  </a>
                  <button onClick={() => handleDeleteAttachment(att.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e34935', padding: '5px' }}>
                    ❌
                  </button>
                </li>
              ))}
              {attachments.length === 0 && <p style={{ fontSize: '14px', color: '#666' }}>No hi ha cap fitxer adjunt.</p>}
            </ul>

            <div style={{ marginTop: '15px' }}>
              <input type="file" onChange={handleFileUpload} />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, background: '#f4f5f7', padding: '20px', borderRadius: '5px' }}>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Assignat a:</label>
            <select 
              value={issue.assigned_to_id || ""} 
              onChange={handleAssign}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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