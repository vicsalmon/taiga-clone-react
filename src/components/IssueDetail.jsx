import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueDetail({ issueId, onBack, onEdit, onShowNotification }) {
  // Extraemos las listas dinámicas y datos del usuario actual
  const { currentUser, USERS, statuses, issueTypes, priorities, severities } = useContext(UserContext);
  const [issue, setIssue] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueData = await issueService.getById(currentUser.apiKey, issueId);
        setIssue(issueData);

        const attachmentsData = await issueService.getAttachments(currentUser.apiKey, issueId);
        setAttachments(attachmentsData);
      } catch (error) {
        console.error(error);
        onShowNotification('Error al carregar els detalls de la incidència.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [issueId, currentUser.apiKey, onShowNotification]);

  const handleDelete = async () => {
    // mantenim el confirm natiu nomes per a accions destructives critiques globals
    const confirm = window.confirm("N'estàs segur que vols eliminar aquesta incidència? Aquesta acció no es pot desfer.");
    if (!confirm) return;

    try {
      await issueService.delete(currentUser.apiKey, issueId);
      onShowNotification('Incidència eliminada correctament.', 'success');
      setTimeout(() => onBack(), 1500);
    } catch (error) {
      console.error(error);
      onShowNotification("Error a l'eliminar la incidència.", 'error');
    }
  };

  const handleAssign = async (e) => {
    if (!issue) return; 

    const rawValue = e.target.value;
    const newAssigneeId = (rawValue === "" || rawValue === "undefined") ? null : parseInt(rawValue, 10);
    
    try {
      const payload = {
        subject: issue.subject,
        description: issue.description || "",
        status_id: parseInt(issue.status_id, 10),
        priority_id: parseInt(issue.priority_id, 10),
        severity_id: parseInt(issue.severity_id, 10),
        issue_type_id: parseInt(issue.issue_type_id, 10),
        assigned_to_id: newAssigneeId
      };

      if (issue.deadline) payload.deadline = issue.deadline;

      const updatedIssue = await issueService.update(currentUser.apiKey, issueId, payload);
      setIssue(updatedIssue);
      onShowNotification("Assignació actualitzada", "success");
    } catch (error) {
      console.error(error);
      onShowNotification("Error canviant assignació.", "error");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await issueService.uploadAttachment(currentUser.apiKey, issueId, file);
      const updatedAttachments = await issueService.getAttachments(currentUser.apiKey, issueId);
      setAttachments(updatedAttachments);
      e.target.value = null; // Reinicia el input file
      onShowNotification('Fitxer pujat correctament.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error pujant el fitxer adjunt.', 'error');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await issueService.deleteAttachment(currentUser.apiKey, attachmentId);
      setAttachments(attachments.filter(att => att.id !== attachmentId));
      onShowNotification('Fitxer adjunt eliminat correctament.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error eliminant el fitxer adjunt.', 'error');
    }
  };

  // Funciones helper para obtener los nombres visuales
  const getName = (list, id) => list?.find(item => item.id === id)?.name || "Desconegut";

  if (loading) return <div className="panel" style={{textAlign: 'center', padding: '50px'}}>Carregant detall...</div>;
  if (!issue) return null;

  return (
    <div className="panel" style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
      
      <div className="detail-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="detail-title-block">
          <span className="detail-id" style={{ color: '#888', marginRight: '10px' }}>#{issue.id}</span>
          <h2 className="detail-subject" style={{ display: 'inline' }}>{issue.subject}</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(issue)} className="btn btn-neutral">Editar</button>
          <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
          <button onClick={onBack} className="btn btn-secondary">Tornar</button>
        </div>
      </div>

      <div className="detail-grid" style={{ display: 'flex', gap: '40px' }}>
        
        {/* COLUMNA PRINCIPAL (Descripción + Adjuntos) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="description-panel panel" style={{boxShadow: 'none', border: '1px solid #eee', padding: '20px', borderRadius: '5px'}}>
            <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '13px' }}>Descripció</h4>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
              {issue.description || <em style={{color: '#aaa'}}>Sense descripció ampliada...</em>}
            </p>
          </div>

          <div className="attachments-panel panel" style={{boxShadow: 'none', border: '1px solid #eee', padding: '20px', borderRadius: '5px'}}>
            <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '13px' }}>Fitxers Adjunts</h4>
            
            <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 15px 0' }}>
              {attachments.map(att => (
                <li key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '10px', background: '#f8f9fa', border: '1px solid #eee', borderRadius: '4px' }}>
                  <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0052cc', wordBreak: 'break-all', fontSize: '14px' }}>
                    {att.filename} ({Math.round(att.byte_size / 1024)} KB)
                  </a>
                  <button onClick={() => handleDeleteAttachment(att.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e34935', padding: '5px', fontSize: '14px' }}>
                    ❌
                  </button>
                </li>
              ))}
              {attachments.length === 0 && <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>No hi ha cap fitxer adjunt.</p>}
            </ul>

            <div>
              <input type="file" onChange={handleFileUpload} style={{ fontSize: '14px' }} />