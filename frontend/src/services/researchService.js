import api from "./api";

export const researchService = {
  // Start a new research session — agent runs in background
  startResearch: async (projectId, query, maxResults = 10) => {
    const response = await api.post(`/api/v1/projects/${projectId}/research`, {
      query,
      max_results: maxResults,
    });
    return response.data;
  },

  // Get all past sessions for a project (history)
  getSessions: async (projectId) => {
    const response = await api.get(`/api/v1/projects/${projectId}/research`);
    return response.data;
  },

  // Poll status of a running session
  getStatus: async (projectId, taskId) => {
    const response = await api.get(
      `/api/v1/projects/${projectId}/research/${taskId}`
    );
    return response.data;
  },

  // Fetch final results once COMPLETED
  getResults: async (taskId) => {
    const response = await api.get(`/api/v1/research/${taskId}/results`);
    return response.data;
  },
};
