import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueDetail({ issueId, onBack, onEdit, onShowNotification }) {
  const { currentUser, USERS, statuses, issueTypes, priorities, severities } = useContext(UserContext);
  const [issue, setIssue] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [watchers, setWatchers] = useState([]);
  const [watcherToAdd, setWatcherToAdd] = useState('');
  const [watchersLoading, setWatchersLoading] = useState(false);
  const [watchersError, setWatchersError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await issueService.getComments(currentUser.apiKey, issueId);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
        setCommentsError('Error al carregar els comentaris.');
      }
    };

    if (issueId) {
      fetchComments();
    }
  }, [issueId, currentUser.apiKey]);

  const fetchWatchers = async () => {
    try {
      const watchersData = await issueService.getWatchers(currentUser.apiKey, issueId);
      setWatchers(watchersData);
    } catch (error) {
      console.error(error);
      setWatchersError('Error carregant els watchers.');
    }
  };

  useEffect(() => {
    if (issueId) {
      fetchWatchers();
    }
  }, [issueId, currentUser.apiKey]);

  const isIssueOwner = issue && parseInt(issue.user_id, 10) === currentUser.id;

  const getCommentOwnerId = (comment) => {
    return parseInt(comment.created_by?.id || comment.user?.id || comment.author?.id || comment.user_id || comment.author?.user_id || 0, 10);
  };

  const isCommentOwner = (comment) => getCommentOwnerId(comment) === currentUser.id;

  const getWatcherId = (watcher) => {
    return parseInt(
      watcher.id || watcher.user?.id || watcher.user_id || watcher.watcher_id || watcher.user?.user_id || 0,
      10
    );
  };

  const getWatcherName = (watcher) => {
    const watcherName = watcher.full_name || watcher.name || watcher.username || watcher.user?.name || watcher.user?.full_name || watcher.user?.username;
    if (watcherName) return watcherName;

    const watcherId = getWatcherId(watcher);
    const user = USERS.find((u) => u.id === watcherId);
    return user ? user.name : 'Usuari desconegut';
  };

  const getCommentAuthor = (comment) => {
    return comment.created_by?.full_name || comment.user?.name || comment.author?.username || 'Usuari desconegut';
  };

  const startEditComment = (comment) => {
    setCurrentEditId(comment.id);
    setEditCommentText(comment.content || '');
  };

  const cancelEditComment = () => {
    setCurrentEditId(null);
    setEditCommentText('');
  };

  const handleAddWatcher = async () => {
    const watcherId = parseInt(watcherToAdd, 10);
    if (!watcherId) {
      onShowNotification('Selecciona un usuari per afegir com a watcher.', 'error');
      return;
    }

    try {
      setWatchersLoading(true);
      await issueService.addWatcher(currentUser.apiKey, issueId, { user_id: watcherId });
      await fetchWatchers();
      setWatcherToAdd('');
      onShowNotification('Watcher afegit.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error afegint el watcher.', 'error');
    } finally {
      setWatchersLoading(false);
    }
  };

  const handleRemoveWatcher = async (watcherId) => {
    const confirmRemove = window.confirm('Segur que vols eliminar aquest watcher?');
    if (!confirmRemove) return;

    try {
      setWatchersLoading(true);
      const removed = await issueService.removeWatcher(currentUser.apiKey, issueId, watcherId);
      if (!removed) throw new Error('No s ha pogut eliminar');
      setWatchers((prev) => prev.filter((watcher) => getWatcherId(watcher) !== watcherId));
      onShowNotification('Watcher eliminat.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error eliminant el watcher.', 'error');
    } finally {
      setWatchersLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    const trimmedText = editCommentText.trim();
    if (!trimmedText) {
      onShowNotification('El comentari no pot estar buit.', 'error');
      return;
    }

    try {
      setEditLoading(true);
      const updatedComment = await issueService.updateComment(currentUser.apiKey, commentId, { content: trimmedText });
      setComments(comments.map(comment => comment.id === commentId ? updatedComment : comment));
      setCurrentEditId(null);
      setEditCommentText('');
      onShowNotification('Comentari actualitzat.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error actualitzant el comentari.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('Segur que vols eliminar aquest comentari?');
    if (!confirmDelete) return;

    try {
      const deleted = await issueService.deleteComment(currentUser.apiKey, commentId);
      if (!deleted) throw new Error('No s ha pogut eliminar');
      setComments(comments.filter(comment => comment.id !== commentId));
      onShowNotification('Comentari eliminat.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error eliminant el comentari.', 'error');
    }
  };

  const handleAddComment = async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText) {
      onShowNotification('El comentari no pot estar buit.', 'error');
      return;
    }

    try {
      setCommentLoading(true);
      const newComment = await issueService.addComment(currentUser.apiKey, issueId, { content: trimmedText });
      setComments([newComment, ...comments]);
      setCommentText('');
      onShowNotification('Comentari afegit amb èxit.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error afegint el comentari.', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
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
      e.target.value = null;
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

  const handleDeleteDeadline = async () => {
    try {
      await issueService.deleteDeadline(currentUser.apiKey, issueId);
      setIssue(prev => ({ ...prev, deadline: null }));
      onShowNotification('Data límit eliminada.', 'success');
    } catch (error) {
      console.error(error);
      onShowNotification('Error eliminant la data límit.', 'error');
    }
  };

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
            </div>
          </div>

          <div className="comments-panel panel" style={{ boxShadow: 'none', border: '1px solid #eee', padding: '20px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', textTransform: 'uppercase', fontSize: '13px' }}>Comentaris</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>{comments.length} comentari{comments.length === 1 ? '' : 's'}</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                placeholder="Escriu aquí el teu comentari..."
                style={{ width: '100%', minHeight: '100px', padding: '14px', borderRadius: '6px', border: '1px solid #d8dde4', resize: 'vertical', fontSize: '14px', color: '#333' }}
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading}
                className="btn btn-primary"
                style={{ marginTop: '12px' }}
              >
                {commentLoading ? 'Afegint...' : 'Afegir comentari'}
              </button>
            </div>

            {commentsError && <p style={{ color: '#d23669', fontSize: '13px', marginBottom: '15px' }}>{commentsError}</p>}

            {comments.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Encara no hi ha cap comentari en aquesta issue.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{ background: '#fff', border: '1px solid #e6ecf1', borderRadius: '6px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#2f4359' }}>{getCommentAuthor(comment)}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{new Date(comment.created_at).toLocaleString('ca-ES')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#60768f', background: '#eef3f8', padding: '4px 10px', borderRadius: '999px' }}>#{issue.id}</span>
                        {isIssueOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #e34935',
                              color: '#e34935',
                              borderRadius: '5px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Eliminar
                          </button>
                        )}
                        {isCommentOwner(comment) && currentEditId !== comment.id && (
                          <button
                            onClick={() => startEditComment(comment)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #4c8bf5',
                              color: '#4c8bf5',
                              borderRadius: '5px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                    {currentEditId === comment.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          rows={4}
                          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d8dde4', fontSize: '14px', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={cancelEditComment}
                            style={{ background: 'transparent', border: '1px solid #bbb', color: '#555', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer' }}
                          >
                            Cancel·lar
                          </button>
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={editLoading}
                            className="btn btn-primary"
                            style={{ padding: '8px 14px' }}
                          >
                            {editLoading ? 'Guardant...' : 'Guardar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.7', color: '#333' }}>{comment.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-panel" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '6px', border: '1px solid #eee', alignSelf: 'start', flex: 1 }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px', marginTop: 0 }}>
            Atributs
          </h4>
          <div className="meta-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
            <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Assignat a</span>
            <select 
              value={issue.assigned_to_id || ""} 
              onChange={handleAssign} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Sense assignar</option>
              {USERS.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="meta-item" style={{ marginBottom: '15px' }}>
            <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Tipus:</span>
            <span style={{fontWeight: '500', marginLeft: '10px'}}>{getName(issueTypes, issue.issue_type_id)}</span>
          </div>
          <div className="meta-item" style={{ marginBottom: '15px' }}>
            <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Estat:</span>
            <span style={{fontWeight: '500', background: '#e4e6ea', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginLeft: '10px'}}>
              {getName(statuses, issue.status_id)}
            </span>
          </div>
          <div className="meta-item" style={{ marginBottom: '15px' }}>
            <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Prioritat:</span>
            <span style={{ marginLeft: '10px' }}>{getName(priorities, issue.priority_id)}</span>
          </div>
          <div className="meta-item" style={{ marginBottom: '15px' }}>
            <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Severitat:</span>
            <span style={{ marginLeft: '10px' }}>{getName(severities, issue.severity_id)}</span>
          </div>
          <div className="meta-item" style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="meta-label" style={{ fontWeight: 'bold', fontSize: '14px' }}>Data Límit:</span>
              {issue.deadline && (
                <button onClick={handleDeleteDeadline} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e34935', fontSize: '12px' }}>
                  Eliminar
                </button>
              )}
            </div>
            <span style={{ color: issue.deadline ? '#333' : '#aaa', display: 'block', marginTop: '5px' }}>
              {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "Sense especificar"}
            </span>
          </div>

          <div className="watchers-sidebar-panel" style={{ marginTop: '25px', background: '#fff', padding: '18px', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', textTransform: 'uppercase', fontSize: '13px' }}>Watchers</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>{watchers.length} watcher{watchers.length === 1 ? '' : 's'}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
              <select
                value={watcherToAdd}
                onChange={(e) => setWatcherToAdd(e.target.value)}
                style={{ flex: '1 1 170px', padding: '10px', borderRadius: '6px', border: '1px solid #d8dde4', fontSize: '14px' }}
              >
                <option value="">Usuari...</option>
                {USERS.filter((user) => !watchers.some((watcher) => getWatcherId(watcher) === user.id)).map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <button
                onClick={handleAddWatcher}
                disabled={watchersLoading || !watcherToAdd}
                className="btn btn-primary"
                style={{ flex: '0 0 auto', minWidth: '120px' }}
              >
                {watchersLoading ? 'Afegint...' : 'Afegir'}
              </button>
            </div>
            {watchersError && <p style={{ color: '#d23669', fontSize: '13px', marginBottom: '15px' }}>{watchersError}</p>}
            {watchers.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Cap watcher assignat.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: 0 }}>
                {watchers.map((watcher) => (
                  <div key={getWatcherId(watcher)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f8fb', borderRadius: '999px', padding: '8px 12px', border: '1px solid #d8dde4' }}>
                    <span style={{ fontSize: '13px', color: '#2f4359' }}>{getWatcherName(watcher)}</span>
                    <button
                      onClick={() => handleRemoveWatcher(getWatcherId(watcher))}
                      disabled={watchersLoading}
                      style={{ background: 'transparent', border: 'none', color: '#e34935', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}