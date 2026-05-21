const API_BASE_URL = "https://taiga-app.onrender.com/api/v1";

const getHeaders = (apiKey) => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Api-Key": apiKey
});

export const issueService = {
  // VISUALITZAR, FILTRAR, ORDENAR I CERCAR
  getAll: async (apiKey, filters = {}) => {
    const params = new URLSearchParams();
    
    // Recorre el objeto y añade a la URL solo lo que tiene texto
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/issues?${params.toString()}`, { 
      headers: getHeaders(apiKey) 
    });
    
    if (!response.ok) throw new Error("Error carregant issues");
    return response.json();
  },

  // VISUALITZAR DETALL
  getById: async (apiKey, id) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, { headers: getHeaders(apiKey) });
    if (!response.ok) throw new Error("Error carregant issue");
    return response.json();
  },

  // CREAR
  create: async (apiKey, issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(issueData)
    });
    return response.json();
  },

  // EDITAR / ASSIGNAR
  update: async (apiKey, id, issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "PUT",
      headers: getHeaders(apiKey),
      body: JSON.stringify(issueData)
    });
    return response.json();
  },

  // ELIMINAR
  delete: async (apiKey, id) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  },

  // BULK INSERT
  bulkInsert: async (apiKey, text) => {
    const response = await fetch(`${API_BASE_URL}/issues/bulk`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify({ text })
    });
    return response.json();
  },

  getStatuses: async (apiKey) => {
    const res = await fetch(`${API_BASE_URL}/statuses`, { headers: getHeaders(apiKey) });
    if (!res.ok) return [];
    return res.json();
  },
  
  getIssueTypes: async (apiKey) => {
    const res = await fetch(`${API_BASE_URL}/issue_types`, { headers: getHeaders(apiKey) });
    if (!res.ok) return [];
    return res.json();
  },
  
  getPriorities: async (apiKey) => {
    const res = await fetch(`${API_BASE_URL}/priorities`, { headers: getHeaders(apiKey) });
    if (!res.ok) return [];
    return res.json();
  },
  
  getSeverities: async (apiKey) => {
    const res = await fetch(`${API_BASE_URL}/severities`, { headers: getHeaders(apiKey) });
    if (!res.ok) return [];
    return res.json();
  }
};