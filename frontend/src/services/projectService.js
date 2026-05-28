import api from "./api";

export const projectService = {
  // Get all projects for current user
  getProjects: async () => {
    const res = await api.get("/api/v1/projects/");
    return res.data;
  },

  // Get single project by ID
  getProject: async (projectId) => {
    const res = await api.get(`/api/v1/projects/${projectId}`);
    return res.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const res = await api.post("/api/v1/projects/", projectData);
    return res.data;
  },

  // Update project
  updateProject: async (projectId, updateData) => {
    const res = await api.put(`/api/v1/projects/${projectId}`, updateData);
    return res.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const res = await api.delete(`/api/v1/projects/${projectId}`);
    return res.data;
  },
};
