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
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/issues?${params.toString()}`, { headers: getHeaders(apiKey) });
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
  }
};