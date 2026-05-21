import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueList({ onNavigateToBulk, onNavigateToCreate, onViewDetail, onNavigateToSettings }) {
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
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-64">
            <span className="material-symbols-outlined text-gray-400 text-[18px] mr-2">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full text-gray-800 placeholder-gray-400 outline-none" 
              placeholder="Search subject..." 
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onNavigateToSettings} title="Configuració" className="text-gray-500 hover:bg-gray-100 transition-colors rounded-full p-2 flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 ml-2">
             <img 
               alt="User profile" 
               className="w-8 h-8 rounded-full border border-gray-200" 
               src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=f3f4f6&color=333`} 
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
        
        {/* Header Section */}
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

        {/* Filters Section */}
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

        {/* Data Table */}
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
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subjecte</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estat</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipus</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prioritat</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Severitat</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Creador</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assignat</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {issues.map((issue, index) => {
                    const statusName = getName(statuses, issue.status_id);
                    const statusColor = getColor(statuses, issue.status_id);
                    const priorityColor = getColor(priorities, issue.priority_id);
                    const severityColor = getColor(severities, issue.severity_id);
                    
                    return (
                      <tr key={issue.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4 text-gray-400 font-medium">#{issue.id}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => onViewDetail(issue.id)}>
                          {issue.subject}
                        </td>
                        <td className="px-5 py-4">
                          {/* Opacidad en HEX añadiendo '15' (aprox 10%) al final del color */}
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
                        <td className="px-5 py-4 text-gray-600">{getName(issueTypes, issue.issue_type_id)}</td>
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
                        <td className="px-5 py-4 text-gray-600">{getUserNameById(issue.user_id)}</td>
                        <td className="px-5 py-4 text-gray-600">{getUserNameById(issue.assigned_to_id)}</td>
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