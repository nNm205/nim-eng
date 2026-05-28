import api from "./api";

export const reportService = {
  // Get all reports for a project
  getProjectReports: async (projectId) => {
    const res = await api.get(`/api/v1/projects/${projectId}/reports`);
    return res.data.reports;
  },

  // Get single report
  getReport: async (reportId) => {
    const res = await api.get(`/api/v1/reports/${reportId}`);
    return res.data;
  },

  // Create new report
  createReport: async (projectId, reportData) => {
    const res = await api.post(`/api/v1/projects/${projectId}/reports`, reportData);
    return res.data;
  },

  // Update report
  updateReport: async (reportId, updateData) => {
    const res = await api.put(`/api/v1/reports/${reportId}`, updateData);
    return res.data;
  },

  // Delete report
  deleteReport: async (reportId) => {
    await api.delete(`/api/v1/reports/${reportId}`);
  },

  // Export report
  exportReport: async (reportId) => {
    const res = await api.post(`/api/v1/reports/${reportId}/export`);
    return res.data;
  },

  // Download report
  downloadReport: async (reportId, format) => {
    const res = await api.get(`/api/v1/reports/${reportId}/download/${format}`);
    return res.data;
  },
};
