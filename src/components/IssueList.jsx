import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';
import UserAvatar from './UserAvatar';

export default function IssueList({ onNavigateToBulk, onNavigateToCreate, onViewDetail, onNavigateToSettings, onNavigateToProfile}) {
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

  const getName = (list, id) => list?.find(item => item.id === id)?.name || "-";
  const getColor = (list, id) => list?.find(item => item.id === id)?.color || "#6b7280";

  const handleSortHeader = (field) => {
    setFilters((prev) => {
      const isCurrent = prev.sort === field;
      
      if (!isCurrent) {
        // Primer clic en este campo: ordena ascendent
        return { ...prev, sort: field, direction: 'asc' };
      }
      
      if (prev.direction === 'asc') {
        // Segundo clic: cambia a descendent
        return { ...prev, sort: field, direction: 'desc' };
      }
      
      // Tercer clic: quita la ordenación (vuelve a id desc)
      return { ...prev, sort: 'id', direction: 'desc' };
    });
  };

  const renderSortIndicator = (field) => {
    if (filters.sort !== field) return <span className="text-gray-400">↕</span>;
    return (
      <span className="text-sm">{filters.direction === 'asc' ? '▲' : '▼'}</span>
    );
  };

  useEffect(() => {
    fetchIssues();
  }, [currentUser, filters.query, filters.sort, filters.direction, filters.type, filters.status, filters.priority, filters.severity]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="bg-gray-50 antialiased min-h-screen flex flex-col w-full font-[Inter]">
      {/* TopNavBar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-6 h-16 w-full z-40 sticky top-0">
        <div className="flex items-center gap-6">
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onNavigateToSettings} title="Configuració" className="text-gray-500 hover:bg-gray-100 transition-colors rounded-full p-2 flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 ml-2">
             {/* COMPONENT USER AVATAR A LA CABECERA */}
             <UserAvatar 
               userId={currentUser.id} 
               size="w-9 h-9" 
               onClick={() => onNavigateToProfile(currentUser.id)} 
             />
             <div className="relative flex items-center hidden sm:flex">
               <select 
                 value={currentUser.id} 
                 onChange={(e) => {
                   const selectedUser = USERS.find(u => u.id === parseInt(e.target.value));
                   setCurrentUser(selectedUser);
                 }}
                 className="appearance-none bg-transparent font-semibold text-sm text-gray-800 outline-none cursor-pointer pr-5 z-10 relative"
               >
                 {USERS.map((u) => (
                   <option key={u.id} value={u.id}>{u.name}</option>
                 ))}
               </select>
               <span className="material-symbols-outlined text-gray-500 text-sm absolute right-0 pointer-events-none">expand_more</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Incidències</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onNavigateToCreate} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Incidència
            </button>
            <button onClick={onNavigateToBulk} className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              Inserció Massiva
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-full md:w-64">
          <span className="material-symbols-outlined text-gray-400 text-[18px] mr-2">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full text-gray-800 placeholder-gray-400 outline-none" 
            placeholder="Cercar per assumpte..." 
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </form>

        <section className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="">Tipus (Tots)</option>
                {issueTypes.map(it => <option key={it.id} value={it.name}>{it.name}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
            
            <div className="relative">
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="">Estat (Tots)</option>
                {statuses.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>

            <div className="relative">
              <select 
                value={filters.priority} 
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="">Prioritat (Totes)</option>
                {priorities.map(pr => <option key={pr.id} value={pr.name}>{pr.name}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>

            <div className="relative">
              <select 
                value={filters.severity} 
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="">Severitat (Totes)</option>
                {severities.map(sv => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Ordenar per:</span>
            <div className="relative">
              <select 
                value={filters.sort} 
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="id">ID</option>
                <option value="type">Tipus</option>
                <option value="severity">Severitat</option>
                <option value="priority">Prioritat</option>
                <option value="deadline">Data Límit</option>
                <option value="status">Estat</option>
                <option value="creator">Creador</option>
                <option value="assignee">Assignat</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
            
            <div className="relative">
              <select 
                value={filters.direction} 
                onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer outline-none hover:bg-gray-50">
                <option value="desc">Descendent</option>
                <option value="asc">Ascendent</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
        </section>


        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 mb-8">
          {loading ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-4xl text-gray-300 animate-spin">refresh</span>
              <p className="text-gray-500 mt-2 text-sm">Carregant dades...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('id')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        ID {renderSortIndicator('id')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('subject')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Subjecte {renderSortIndicator('subject')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('status')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Estat {renderSortIndicator('status')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('type')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Tipus {renderSortIndicator('type')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('priority')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Prioritat {renderSortIndicator('priority')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('severity')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Severitat {renderSortIndicator('severity')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('deadline')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Deadline {renderSortIndicator('deadline')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('creator')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Creador {renderSortIndicator('creator')}
                      </button>
                    </th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button type="button" onClick={() => handleSortHeader('assignee')} className="flex items-center gap-1 text-left w-full text-gray-500 hover:text-emerald-600 transition-colors">
                        Assignat {renderSortIndicator('assignee')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {issues.map((issue, index) => {
                    const statusName = getName(statuses, issue.status_id);
                    const statusColor = getColor(statuses, issue.status_id);
                    const typeColor = getColor(issueTypes, issue.issue_type_id);
                    const priorityColor = getColor(priorities, issue.priority_id);
                    const severityColor = getColor(severities, issue.severity_id);
                    
                    return (
                      <tr key={issue.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-medium">#{issue.id}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => onViewDetail(issue.id)}>
                          {issue.subject}
                        </td>
                        <td className="px-5 py-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center border"
                            style={{ backgroundColor: `${statusColor}15`, color: statusColor, borderColor: `${statusColor}30` }}
                          >
                            {statusName}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColor }}></span>
                             {getName(issueTypes, issue.issue_type_id)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor }}></span>
                            {getName(priorities, issue.priority_id)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColor }}></span>
                            {getName(severities, issue.severity_id)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "-"}
                        </td>
                        
                        {/* COLUMNA CREADOR */}
                        <td className="px-5 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <UserAvatar 
                              userId={issue.user_id} 
                              onClick={(e) => { e.stopPropagation(); onNavigateToProfile(issue.user_id); }} 
                            />
                            <span 
                              onClick={(e) => { e.stopPropagation(); onNavigateToProfile(issue.user_id); }} 
                              className="cursor-pointer hover:text-emerald-600 hover:underline font-medium"
                            >
                              {getUserNameById(issue.user_id)}
                            </span>
                          </div>
                        </td>

                        {/* COLUMNA ASSIGNAT */}
                        <td className="px-5 py-4 text-gray-600">
                          {issue.assigned_to_id ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar 
                                userId={issue.assigned_to_id} 
                                onClick={(e) => { e.stopPropagation(); onNavigateToProfile(issue.assigned_to_id); }} 
                              />
                              <span 
                                onClick={(e) => { e.stopPropagation(); onNavigateToProfile(issue.assigned_to_id); }} 
                                className="cursor-pointer hover:text-emerald-600 hover:underline font-medium"
                              >
                                {getUserNameById(issue.assigned_to_id)}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {issues.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-10 text-gray-500">No s'han trobat incidències amb aquests filtres.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}