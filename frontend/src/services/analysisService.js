import api from "./api";

export const analysisService = {
  // Start analysis for a document
  startAnalysis: async (projectId, documentId) => {
    const res = await api.post(`/api/v1/projects/${projectId}/analyze`, null, {
      params: { document_id: documentId }
    });
    return res.data;
  },

  // Get project analyses
  getProjectAnalyses: async (projectId) => {
    const res = await api.get(`/api/v1/projects/${projectId}/analyses`);
    return res.data;
  },

  // Get analysis status
  getAnalysisStatus: async (projectId, taskId) => {
    const res = await api.get(`/api/v1/projects/${projectId}/analysis/${taskId}`);
    return res.data;
  },

  // Get analysis results
  getAnalysisResults: async (taskId) => {
    const res = await api.get(`/api/v1/analysis/${taskId}/results`);
    return res.data;
  },

  // Get document summary
  getDocumentSummary: async (documentId) => {
    const res = await api.get(`/api/v1/documents/${documentId}/summary`);
    return res.data;
  },

  // Get document entities
  getDocumentEntities: async (documentId) => {
    const res = await api.get(`/api/v1/documents/${documentId}/entities`);
    return res.data;
  },
};
