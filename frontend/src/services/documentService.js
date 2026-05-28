import api from "./api";

export const documentService = {
  // Get all documents for a project
  getProjectDocuments: async (projectId) => {
    const res = await api.get(`/api/v1/projects/${projectId}/documents`);
    return res.data;
  },

  // Get single document
  getDocument: async (projectId, documentId) => {
    const res = await api.get(`/api/v1/projects/${projectId}/documents/${documentId}`);
    return res.data;
  },

  // Create new document
  createDocument: async (projectId, documentData) => {
    const res = await api.post(`/api/v1/projects/${projectId}/documents`, documentData);
    return res.data;
  },

  // Update document
  updateDocument: async (projectId, documentId, updateData) => {
    const res = await api.patch(`/api/v1/projects/${projectId}/documents/${documentId}`, updateData);
    return res.data;
  },

  // Delete document
  deleteDocument: async (projectId, documentId) => {
    const res = await api.delete(`/api/v1/projects/${projectId}/documents/${documentId}`);
    return res.data;
  },
};
