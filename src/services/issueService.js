const API_BASE_URL = "https://taiga-app.onrender.com/api/v1";

const getHeaders = (apiKey) => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Api-Key": apiKey
});

// helper genèric per fer fetch i llençar error si la resposta no és ok
const request = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Error ${res.status}`);
  }
  // DELETE retorna 204 sense cos
  if (res.status === 204) return true;
  return res.json();
};

// helper per construir les operacions CRUD d'un recurs de configuració
// endpoint: path relatiu sense barra inicial, p.ex. "statuses"
const buildCrud = (endpoint) => ({
  getAll: (apiKey) =>
    request(`${API_BASE_URL}/${endpoint}`, { headers: getHeaders(apiKey) }),

  create: (apiKey, data) =>
    request(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(data)
    }),

  update: (apiKey, id, data) =>
    request(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: getHeaders(apiKey),
      body: JSON.stringify(data)
    }),

  delete: (apiKey, id) =>
    request(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    })
});

// recursos de configuració exposats com a sub-namespaces
export const statusService     = buildCrud("statuses");
export const issueTypeService  = buildCrud("issue_types");
export const priorityService   = buildCrud("priorities");
export const severityService   = buildCrud("severities");
export const tagService        = buildCrud("tags");
export const deadlineShortcutService = buildCrud("deadline_shortcuts");

export const issueService = {
  getAll: async (apiKey, filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
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
      headers: { "Accept": "application/json", "X-Api-Key": apiKey },
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

  // comentaris
  getComments: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/comments`, {
      headers: getHeaders(apiKey)
    });
    if (!response.ok) throw new Error("Error carregant els comentaris");
    return response.json();
  },

  addComment: async (apiKey, issueId, commentData) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/comments`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error("Error creant el comentari");
    return response.json();
  },

  updateComment: async (apiKey, commentId, commentData) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: getHeaders(apiKey),
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error("Error actualitzant el comentari");
    return response.json();
  },

  deleteComment: async (apiKey, commentId) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  },

  // watchers
  getWatchers: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/watching`, {
      headers: getHeaders(apiKey)
    });
    if (!response.ok) throw new Error("Error carregant els watchers");
    return response.json();
  },

  addWatcher: async (apiKey, issueId, watcherData) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/watching`, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(watcherData)
    });
    if (!response.ok) throw new Error("Error afegint watcher");
    return response.json();
  },

  removeWatcher: async (apiKey, issueId, userId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/watching?user_id=${userId}`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  },

  // atallers de getters individuals mantinguts per compatibilitat amb el context
  getStatuses:    (apiKey) => statusService.getAll(apiKey),
  getIssueTypes:  (apiKey) => issueTypeService.getAll(apiKey),
  getPriorities:  (apiKey) => priorityService.getAll(apiKey),
  getSeverities:  (apiKey) => severityService.getAll(apiKey),
  getTags:        (apiKey) => tagService.getAll(apiKey),
  getDeadlineShortcuts: (apiKey) => deadlineShortcutService.getAll(apiKey),

  // gestió deadlines
  deleteDeadline: async (apiKey, issueId) => {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/deadline`, {
      method: "DELETE",
      headers: getHeaders(apiKey)
    });
    return response.ok;
  }
};
