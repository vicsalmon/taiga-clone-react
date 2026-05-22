import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import UserAvatar from './UserAvatar';

export default function UserProfile({ 
  userId, 
  onBack, 
  onShowNotification, 
  onNavigateToEdit, 
  onViewDetail, //Necessitem rebre aquesta prop des d'App.jsx per navegar a la incidència del comentari
  onNavigateToProfile
}) {
  const { getUserNameById, currentUser, statuses, issueTypes, priorities, severities } = useContext(UserContext);
  
  //Estats del component
  const [userApiData, setUserApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  
  //Estats de dades de les pestanyes
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [watchedIssues, setWatchedIssues] = useState([]);
  const [comments, setComments] = useState([]);
  
  //Estats d'ordenació per a les incidències
  const [sortConfig, setSortConfig] = useState({ column: 'id', direction: 'desc' });

  // çEstats per l'edició inline de comentaris
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const isCurrentUser = currentUser.id === userId;

  //Carregar dades de l'usuari
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}`, {
          headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setUserApiData(data);
        }
      } catch (err) {
        console.error(err);
        onShowNotification("Error al carregar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId, currentUser.apiKey, onShowNotification]);

  //Carregar el contingut de les pestanyes (amb ordenació)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Cargar Assigned Issues
        const resAssigned = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}/assigned_issues?sort=${sortConfig.column}&direction=${sortConfig.direction}`, {
          headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
        });
        if (resAssigned.ok) setAssignedIssues(await resAssigned.json());

        // Cargar Watched Issues (solo si es el usuario logueado)
        if (isCurrentUser) {
          const resWatched = await fetch(`https://taiga-app.onrender.com/api/v1/users/${userId}/watched_issues?sort=${sortConfig.column}&direction=${sortConfig.direction}`, {
            headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
          });
          if (resWatched.ok) setWatchedIssues(await resWatched.json());
        }

        // Cargar Comentarios (recuperando todas las issues y sus comentarios, ya que no hay endpoint directo)
        const resIssues = await fetch(`https://taiga-app.onrender.com/api/v1/issues`, {
          headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
        });
        if (resIssues.ok) {
          const allIssues = await resIssues.json();
          const commentsPromises = allIssues.map(async (issue) => {
            try {
              const resComments = await fetch(`https://taiga-app.onrender.com/api/v1/issues/${issue.id}/comments`, {
                headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
              });
              if (resComments.ok) {
                const issueComments = await resComments.json();
                return issueComments.map(c => ({
                  ...c,
                  issue: {
                    id: issue.id,
                    subject: issue.subject
                  }
                }));
              }
            } catch (err) {
              console.error(`Error carregant comentaris per a la issue ${issue.id}`, err);
            }
            return [];
          });
          const allCommentsNested = await Promise.all(commentsPromises);
          const allComments = allCommentsNested.flat();
          const filteredComments = allComments.filter(c => {
            const commentAuthorId = parseInt(c.user_id || c.user?.id || c.created_by?.id || c.author?.id, 10);
            return commentAuthorId === parseInt(userId, 10);
          });
          filteredComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setComments(filteredComments);
        }

      } catch (err) {
        console.error("Error al cargar datos", err);
      }
    };
    
    if (userId) fetchAllData();
    // Quitamos 'activeTab' de las dependencias para que cargue todo al principio
  }, [userId, sortConfig, currentUser.apiKey, isCurrentUser]);

  //Gestor d'ordenació
  const handleSort = (column) => {
    setSortConfig(prev => {
      const isCurrent = prev.column === column;
      if (!isCurrent) {
        return { column, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column, direction: 'desc' };
      }
      return { column: 'id', direction: 'desc' };
    });
  };

  const renderSortIndicator = (field) => {
    if (sortConfig.column !== field) return <span className="text-gray-400">↕</span>;
    return (
      <span className="text-sm">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
    );
  };

  //Funcions per mostrar noms i colors (Helpers)
  const getName = (list, id) => list?.find(item => item.id === id)?.name || "-";
  const getColor = (list, id) => list?.find(item => item.id === id)?.color || "#6b7280";

  //Gestors de Comentaris (Esborrar i Editar)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Estàs segur que vols esborrar aquest comentari?")) return;
    try {
      const res = await fetch(`https://taiga-app.onrender.com/api/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'X-Api-Key': currentUser.apiKey, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        onShowNotification("Comentari esborrat", "success");
      }
    } catch (err) {
      onShowNotification("Error a l'esborrar el comentari", "error");
    }
  };

  const handleSaveCommentEdit = async (commentId) => {
    try {
      const res = await fetch(`https://taiga-app.onrender.com/api/v1/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 
          'X-Api-Key': currentUser.apiKey, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: editCommentText })
      });
      if (res.ok) {
        const updatedComment = await res.json();
        setComments(comments.map(c => c.id === commentId ? { ...c, content: updatedComment.content } : c));
        setEditingCommentId(null);
        onShowNotification("Comentari actualitzat", "success");
      }
    } catch (err) {
      onShowNotification("Error al guardar el comentari", "error");
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Carregant perfil...</div>;

  //Renderitzat de la taula d'issues (Reutilitzable per assigned i watched)
  const renderIssuesTable = (issuesList) => (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[
                { key: 'id', label: 'ID' },
                { key: 'subject', label: 'Subjecte' },
                { key: 'status', label: 'Estat' },
                { key: 'type', label: 'Tipus' },
                { key: 'priority', label: 'Prioritat' },
                { key: 'severity', label: 'Severitat' },
                { key: 'deadline', label: 'Deadline' },
                { key: 'creator', label: 'Creador' },
                { key: 'assignee', label: 'Assignat' },
                { key: 'updated_at', label: 'Modificada' }
              ].map(({ key, label }) => (
                <th key={key} className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button 
                    type="button" 
                    onClick={() => handleSort(key)} 
                    className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {label} {renderSortIndicator(key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 divide-y divide-gray-100">
            {issuesList.length > 0 ? issuesList.map((issue, index) => {
              const statusName = getName(statuses, issue.status_id);
              const statusColor = getColor(statuses, issue.status_id);
              const typeColor = getColor(issueTypes, issue.issue_type_id);
              const priorityColor = getColor(priorities, issue.priority_id);
              const severityColor = getColor(severities, issue.severity_id);
              
              return (
                <tr 
                  key={issue.id || index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail && onViewDetail(issue.id)}
                >
                  {/* ID */}
                  <td className="px-5 py-4 text-gray-400 font-medium">#{issue.id}</td>
                  
                  {/* Subjecte */}
                  <td className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors">
                    {issue.subject}
                  </td>
                  
                  {/* Estat */}
                  <td className="px-5 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center border"
                      style={{ 
                        backgroundColor: `${statusColor}15`, 
                        color: statusColor, 
                        borderColor: `${statusColor}30` 
                      }}
                    >
                      {statusName}
                    </span>
                  </td>
                  
                  {/* Tipus */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColor }}></span>
                      {getName(issueTypes, issue.issue_type_id)}
                    </div>
                  </td>
                  
                  {/* Prioritat */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor }}></span>
                      {getName(priorities, issue.priority_id)}
                    </div>
                  </td>
                  
                  {/* Severitat */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColor }}></span>
                      {getName(severities, issue.severity_id)}
                    </div>
                  </td>
                  
                  {/* Deadline */}
                  <td className="px-5 py-4 text-gray-500">
                    {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "-"}
                  </td>
                  
                  {/* Creador */}
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserAvatar 
                        userId={issue.user_id} 
                        onClick={(e) => { 
                          if (onNavigateToProfile) {
                            e.stopPropagation(); 
                            onNavigateToProfile(issue.user_id); 
                          }
                        }} 
                      />
                      <span 
                        onClick={(e) => { 
                          if (onNavigateToProfile) {
                            e.stopPropagation(); 
                            onNavigateToProfile(issue.user_id); 
                          }
                        }} 
                        className="cursor-pointer hover:text-emerald-600 hover:underline font-medium"
                      >
                        {getUserNameById(issue.user_id)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Assignat */}
                  <td className="px-5 py-4 text-gray-600">
                    {issue.assigned_to_id ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar 
                          userId={issue.assigned_to_id} 
                          onClick={(e) => { 
                            if (onNavigateToProfile) {
                              e.stopPropagation(); 
                              onNavigateToProfile(issue.assigned_to_id); 
                            }
                          }} 
                        />
                        <span 
                          onClick={(e) => { 
                            if (onNavigateToProfile) {
                              e.stopPropagation(); 
                              onNavigateToProfile(issue.assigned_to_id); 
                            }
                          }} 
                          className="cursor-pointer hover:text-emerald-600 hover:underline font-medium"
                        >
                          {getUserNameById(issue.assigned_to_id)}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  
                  {/* Modificada */}
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(issue.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="10" className="px-5 py-8 text-center text-gray-500">
                  No hi ha incidències per mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row gap-8 px-4">
      
      {/* --- BARRA LATERAL ESQUERRA --- */}
      <div className="w-full md:w-1/4 flex flex-col items-center bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
        <button onClick={onBack} className="self-start text-gray-500 hover:text-gray-700 mb-4 text-sm font-medium">
          ← Tornar
        </button>

        <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md flex items-center justify-center mb-4">
          {userApiData && userApiData.avatar_url ? (
            <img src={userApiData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-400 font-bold">
              {getUserNameById(userId).charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
          {userApiData ? userApiData.username : getUserNameById(userId)}
        </h2>
        
        {userApiData && userApiData.email && (
          <p className="text-gray-500 text-sm mb-6">@{userApiData.email.split('@')[0]}</p>
        )}

        {/*CONTADORES ESTILO TAIGA de las pestañas === */}
        {userApiData && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginTop: '15px',
            marginBottom: '15px' 
          }}>
            {/* Open Assigned */}
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '10px', 
              borderRadius: '8px', 
              minWidth: '85px', 
              textAlign: 'center' 
            }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                {assignedIssues.length}
              </span>
              <span style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.2', display: 'block' }}>
                Assignades<br />Obertes
              </span>
            </div>

            {/* Watched Issues */}
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '10px', 
              borderRadius: '8px', 
              minWidth: '85px', 
              textAlign: 'center' 
            }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
                {currentUser?.id === userId ? watchedIssues.length : '-'}
              </span>
              <span style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.2', display: 'block' }}>
                Seguides<br />Incidències
              </span>
            </div>

            {/* Comments */}
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '10px', 
              borderRadius: '8px', 
              minWidth: '85px', 
              textAlign: 'center' 
            }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#4b5563' }}>
                {comments.length} {/* AQUÍ CONTAMOS LA LISTA REAL */}
              </span>
              <span style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.2', display: 'block' }}>
                Comentaris
              </span>
            </div>
          </div>
        )}

        {/* Descripció entre l'email i el botó */}
        <div className="w-full mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Biografia</h3>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {userApiData?.description || <span className="italic text-gray-400">Sense descripció</span>}
          </p>
        </div>

        {/* Botó Editar Perfil (només si és l'usuari actual) */}
        {isCurrentUser && (
          <button 
            onClick={onNavigateToEdit}
            className="w-full py-2 bg-emerald-500 text-white rounded font-medium hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Editar Perfil
          </button>
        )}
      </div>


      {/* --- CONTINGUT PRINCIPAL DRET (Pestanyes) --- */}
      <div className="w-full md:w-3/4 min-w-0">
        {/* Capçalera Pestanyes */}
        <div className="flex border-b border-gray-200 gap-6">
          <button 
            onClick={() => setActiveTab('assigned')}
            className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'assigned' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Incidències assignades obertes
          </button>

          {isCurrentUser && (
            <button 
              onClick={() => setActiveTab('watched')}
              className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'watched' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Incidències seguides
            </button>
          )}

          <button 
            onClick={() => setActiveTab('comments')}
            className={`pb-3 font-medium text-sm transition-colors ${activeTab === 'comments' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Comentaris
          </button>
        </div>

        {/* Contingut Dinàmic de les Pestanyes */}
        <div className="mt-6">
          {activeTab === 'assigned' && renderIssuesTable(assignedIssues)}
          {activeTab === 'watched' && renderIssuesTable(watchedIssues)}
          
          {activeTab === 'comments' && (
            <div className="flex flex-col gap-4">
              {comments.length > 0 ? comments.map(comment => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div 
                      className="text-sm font-semibold text-emerald-600 cursor-pointer hover:underline"
                      onClick={() => onViewDetail && onViewDetail(comment.issue?.id)} // Requereix que a l'App.jsx passis onViewDetail={goToDetail}
                    >
                      A LA INCIDÈNCIA: #{comment.issue?.id} {comment.issue?.subject}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea 
                        className="w-full border rounded p-2 text-sm focus:outline-none focus:border-emerald-500"
                        rows="3"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleSaveCommentEdit(comment.id)} className="bg-emerald-500 text-white px-3 py-1 text-xs rounded hover:bg-emerald-600">Guardar</button>
                        <button onClick={() => setEditingCommentId(null)} className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded hover:bg-gray-200">Cancel·lar</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  )}

                  {isCurrentUser && editingCommentId !== comment.id && (
                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.content); }}
                        className="text-xs font-medium text-gray-500 hover:text-emerald-600"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs font-medium text-gray-500 hover:text-red-500"
                      >
                        Esborrar
                      </button>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">Aquest usuari no ha fet cap comentari.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}