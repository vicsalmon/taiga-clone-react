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
  },

  // llistar els fitxers adjunts d'una issue
  getAttachments: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/attachments`, { 
      headers: getHeaders(apiKey) 
    });
    if (!response.ok) throw new Error("Error carregant els fitxers adjunts");
    return response.json();
  },

  // enviar un fitxer adjunt nou
  // ometem la capçalera content-type perquè el navegador generi el boundary del multipart form-data automàticament
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

  // esborrar un fitxer adjunt pel seu id
  deleteAttachment: async (apiKey, attachmentId) => {
    const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  }
};