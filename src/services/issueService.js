const API_BASE_URL = "https://taiga-app.onrender.com/api/v1";

const getHeaders = (apiKey) => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Api-Key": apiKey
});

export const issueService = {
  getAll: async (apiKey, filters = {}) => {
    const params = new URLSearchParams();
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

  getById: async (apiKey, id) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, { headers: getHeaders(apiKey) });
    if (!response.ok) throw new Error("Error carregant issue");
    return response.json();
  },

  create: async (apiKey, issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(issueData)
    });
    return response.json();
  },

  update: async (apiKey, id, issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "PUT",
      headers: getHeaders(apiKey),
      body: JSON.stringify(issueData)
    });
    return response.json();
  },

  delete: async (apiKey, id) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  },

  bulkInsert: async (apiKey, text) => {
    const response = await fetch(`${API_BASE_URL}/issues/bulk`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify({ text })
    });
    return response.json();
  },

  getAttachments: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/attachments`, { 
      headers: getHeaders(apiKey) 
    });
    if (!response.ok) throw new Error("Error carregant els fitxers adjunts");
    return response.json();
  },

  uploadAttachment: async (apiKey, issueId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/attachments`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-Api-Key": apiKey
      },
      body: formData
    });
    if (!response.ok) throw new Error("Error pujant el fitxer");
  },

  deleteAttachment: async (apiKey, attachmentId) => {
    const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
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
  },

  // --- GESTIÓ DEADLINES ---
  deleteDeadline: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/deadline`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  }
};