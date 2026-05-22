import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';
import UserAvatar from './UserAvatar';

export default function IssueDetail({ issueId, onBack, onEdit, onShowNotification, onNavigateToProfile }) {
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

  // Funciones de obtención de datos
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
    if (issueId) fetchComments();
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
    if (issueId) fetchWatchers();
  }, [issueId, currentUser.apiKey]);

  // Helpers de permisos y visualización
  const isIssueOwner = issue && parseInt(issue.user_id, 10) === currentUser.id;
  
  const getCommentOwnerId = (comment) => parseInt(comment.created_by?.id || comment.user?.id || comment.author?.id || comment.user_id || comment.author?.user_id || 0, 10);
  const isCommentOwner = (comment) => getCommentOwnerId(comment) === currentUser.id;
  
  const getWatcherId = (watcher) => parseInt(watcher.id || watcher.user?.id || watcher.user_id || watcher.watcher_id || watcher.user?.user_id || 0, 10);
  
  const getWatcherName = (watcher) => {
    const watcherName = watcher.full_name || watcher.name || watcher.username || watcher.user?.name || watcher.user?.full_name || watcher.user?.username;
    if (watcherName) return watcherName;
    const user = USERS.find((u) => u.id === getWatcherId(watcher));
    return user ? user.name : 'Usuari desconegut';
  };

  const getCommentAuthor = (comment) => {
    const authorName = comment.created_by?.full_name || comment.user?.name || comment.author?.username;
    if (authorName) return authorName;
    const authorId = getCommentOwnerId(comment);
    const user = USERS.find((u) => u.id === authorId);
    return user ? user.name : 'Usuari desconegut';
  };
  const getName = (list, id) => list?.find(item => item.id === id)?.name || "-";
  const getColor = (list, id) => list?.find(item => item.id === id)?.color || "#6b7280";
  const getUserNameById = (id) => USERS.find((u) => u.id === parseInt(id))?.name || "Sense assignar";

  // Watchers handlers
  const handleAddWatcher = async () => {
    const watcherId = parseInt(watcherToAdd, 10);
    if (!watcherId) return onShowNotification('Selecciona un usuari.', 'error');
    try {
      setWatchersLoading(true);
      await issueService.addWatcher(currentUser.apiKey, issueId, { user_id: watcherId });
      await fetchWatchers();
      setWatcherToAdd('');
      onShowNotification('Watcher afegit.', 'success');
    } catch (error) {
      onShowNotification('Error afegint el watcher.', 'error');
    } finally {
      setWatchersLoading(false);
    }
  };

  const handleRemoveWatcher = async (watcherId) => {
    if (!window.confirm('Segur que vols eliminar aquest watcher?')) return;
    try {
      setWatchersLoading(true);
      await issueService.removeWatcher(currentUser.apiKey, issueId, watcherId);
      setWatchers((prev) => prev.filter((w) => getWatcherId(w) !== watcherId));
      onShowNotification('Watcher eliminat.', 'success');
    } catch (error) {
      onShowNotification('Error eliminant el watcher.', 'error');
    } finally {
      setWatchersLoading(false);
    }
  };

  // Comentarios handlers
  const handleAddComment = async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText) return onShowNotification('El comentari no pot estar buit.', 'error');
    try {
      setCommentLoading(true);
      const newComment = await issueService.addComment(currentUser.apiKey, issueId, { content: trimmedText });
      setComments([newComment, ...comments]);
      setCommentText('');
      onShowNotification('Comentari afegit amb èxit.', 'success');
    } catch (error) {
      onShowNotification('Error afegint el comentari.', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    const trimmedText = editCommentText.trim();
    if (!trimmedText) return onShowNotification('El comentari no pot estar buit.', 'error');
    try {
      setEditLoading(true);
      const updatedComment = await issueService.updateComment(currentUser.apiKey, commentId, { content: trimmedText });
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      setCurrentEditId(null);
      setEditCommentText('');
      onShowNotification('Comentari actualitzat.', 'success');
    } catch (error) {
      onShowNotification('Error actualitzant el comentari.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Segur que vols eliminar aquest comentari?')) return;
    try {
      await issueService.deleteComment(currentUser.apiKey, commentId);
      setComments(comments.filter(c => c.id !== commentId));
      onShowNotification('Comentari eliminat.', 'success');
    } catch (error) {
      onShowNotification('Error eliminant el comentari.', 'error');
    }
  };

  const startEditComment = (comment) => {
    setCurrentEditId(comment.id);
    setEditCommentText(comment.content);
  };

  const cancelEditComment = () => {
    setCurrentEditId(null);
    setEditCommentText('');
  };

  // Issue global actions
  const handleDelete = async () => {
    if (!window.confirm("N'estàs segur que vols eliminar aquesta incidència? Aquesta acció no es pot desfer.")) return;
    try {
      await issueService.delete(currentUser.apiKey, issueId);
      onShowNotification('Incidència eliminada correctament.', 'success');
      setTimeout(() => onBack(), 1500);
    } catch (error) {
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
      onShowNotification("Error canviant assignació.", "error");
    }
  };

  // Archivos & Deadline
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
      onShowNotification('Error pujant el fitxer adjunt.', 'error');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await issueService.deleteAttachment(currentUser.apiKey, attachmentId);
      setAttachments(attachments.filter(att => att.id !== attachmentId));
      onShowNotification('Fitxer adjunt eliminat correctament.', 'success');
    } catch (error) {
      onShowNotification('Error eliminant el fitxer adjunt.', 'error');
    }
  };

  const handleDeleteDeadline = async () => {
    try {
      await issueService.deleteDeadline(currentUser.apiKey, issueId);
      setIssue(prev => ({ ...prev, deadline: null }));
      onShowNotification('Data límit eliminada.', 'success');
    } catch (error) {
      onShowNotification('Error eliminant la data límit.', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-[Inter]"><span className="material-symbols-outlined text-4xl animate-spin text-gray-300">refresh</span><p>Carregant detall...</p></div>;
  if (!issue) return null;

  // Variables calculadas para UI
  const statusColor = getColor(statuses, issue.status_id);
  const priorityColor = getColor(priorities, issue.priority_id);
  const severityColor = getColor(severities, issue.severity_id);

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-gray-400">#{issue.id}</span> {issue.subject}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Creat per {getUserNameById(issue.user_id)} el {new Date(issue.created_at || Date.now()).toLocaleDateString('ca-ES')}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={onBack} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Tornar
            </button>
            <button onClick={() => onEdit(issue)} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">edit</span> Editar
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">delete</span> Eliminar
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Canvas) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Descripció */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">notes</span> Descripció
              </h2>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {issue.description || <em className="text-gray-400">Sense descripció ampliada...</em>}
              </div>
            </section>

            {/* Fitxers Adjunts */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">attach_file</span> Fitxers Adjunts
              </h2>
              
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group mb-4">
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-gray-400">cloud_upload</span>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">Arrossega els fitxers aquí o fes clic per pujar-los</p>
              </div>

              {attachments.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {attachments.map(att => (
                    <li key={att.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium truncate flex-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">draft</span>
                        {att.filename} <span className="text-gray-400 text-xs font-normal">({Math.round(att.byte_size / 1024)} KB)</span>
                      </a>
                      <button onClick={() => handleDeleteAttachment(att.id)} className="text-red-500 hover:text-red-700 p-1 ml-2 transition-colors flex items-center">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Comentaris */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">forum</span> Comentaris <span className="text-gray-400 normal-case ml-1">({comments.length})</span>
              </h2>
              
              <div className="flex gap-4 mb-6">

                {/* COMPONENT USER AVATAR a la caixeta de escriure el missatge*/}
                <UserAvatar 
                  userId={currentUser.id} 
                  size="w-10 h-10" 
                  onClick={() => onNavigateToProfile(currentUser.id)} 
                />

                <div className="flex-1 flex flex-col gap-3">
                  <textarea 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    placeholder="Afegeix un comentari..." 
                    rows="3" 
                    className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm text-gray-900 p-3 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-shadow"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddComment} 
                      disabled={commentLoading} 
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {commentLoading ? 'Afegint...' : 'Afegir comentari'}
                    </button>
                  </div>
                </div>
              </div>

              {commentsError && <p className="text-sm text-red-500 mb-4">{commentsError}</p>}

              <div className="flex flex-col gap-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Encara no hi ha cap comentari.</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            {/*COMPONENT USER AVATAR en el comentario */}
                           <UserAvatar 
                             userId={comment.user_id} 
                             size="w-8 h-8" 
                             onClick={() => onNavigateToProfile(comment.user_id)} 
                           />
                           <div>
                             <div className="text-sm font-bold text-gray-900">{getCommentAuthor(comment)}</div>
                             <div className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString('ca-ES')}</div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {(isIssueOwner || isCommentOwner(comment)) && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-[11px] font-semibold text-red-500 hover:text-red-700 uppercase tracking-wider">Eliminar</button>
                          )}
                          {isCommentOwner(comment) && currentEditId !== comment.id && (
                            <button onClick={() => startEditComment(comment)} className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 uppercase tracking-wider">Editar</button>
                          )}
                        </div>
                      </div>

                      {currentEditId === comment.id ? (
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-gray-300 bg-white text-sm text-gray-900 p-3 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelEditComment} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-xs font-semibold hover:bg-gray-50 transition-colors">Cancel·lar</button>
                            <button onClick={() => handleUpdateComment(comment.id)} disabled={editLoading} className="px-3 py-1.5 bg-indigo-500 text-white rounded text-xs font-semibold hover:bg-indigo-600 transition-colors">
                              {editLoading ? 'Guardant...' : 'Guardar'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-800 whitespace-pre-wrap pl-11">{comment.content}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Atributs */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">tune</span> Atributs
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase">Assignat a</label>
                  <div className="relative">
                    <select value={issue.assigned_to_id || ""} onChange={handleAssign} className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm p-2.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                      <option value="">Sense assignar</option>
                      {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Tipus</span>
                    <span className="text-sm font-medium text-gray-900">{getName(issueTypes, issue.issue_type_id)}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Estat</span>
                    <span 
                      className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                      style={{ backgroundColor: `${statusColor}15`, color: statusColor, borderColor: `${statusColor}30` }}
                    >
                      {getName(statuses, issue.status_id)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Prioritat</span>
                    <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor }}></span>
                      {getName(priorities, issue.priority_id)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Severitat</span>
                    <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColor }}></span>
                      {getName(severities, issue.severity_id)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 uppercase">Data Límit</span>
                    {issue.deadline && (
                      <button onClick={handleDeleteDeadline} className="text-[11px] font-semibold text-red-500 hover:text-red-700 hover:underline">Eliminar</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">calendar_today</span>
                    {issue.deadline ? new Date(issue.deadline).toLocaleDateString('ca-ES') : "Sense establir"}
                  </div>
                </div>
              </div>
            </section>

            {/* Watchers */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">visibility</span> Watchers
                </div>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{watchers.length}</span>
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={watcherToAdd}
                      onChange={(e) => setWatcherToAdd(e.target.value)}
                      className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Selecciona usuari...</option>
                      {USERS.filter((user) => !watchers.some((w) => getWatcherId(w) === user.id)).map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                  <button
                    onClick={handleAddWatcher}
                    disabled={watchersLoading || !watcherToAdd}
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Afegir
                  </button>
                </div>

                {watchersError && <p className="text-sm text-red-500 m-0">{watchersError}</p>}
                
                {watchers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center italic mt-2">Cap watcher actiu</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {watchers.map((watcher) => (
                      <div key={getWatcherId(watcher)} className="flex items-center gap-1.5 bg-gray-100 rounded-full pl-3 pr-1.5 py-1 border border-gray-200">
                        <span className="text-xs font-medium text-gray-700">{getWatcherName(watcher)}</span>
                        <button
                          onClick={() => handleRemoveWatcher(getWatcherId(watcher))}
                          disabled={watchersLoading}
                          className="text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center rounded-full hover:bg-white p-0.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}