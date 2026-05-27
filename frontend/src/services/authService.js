import api from "./api";

export const authService = {
  login: async (email, password) => {
    const res = await api.post("/api/v1/auth/login", { email, password });
    return res.data;
  },

  register: async (payload) => {
    const res = await api.post("/api/v1/auth/register", payload);
    return res.data;
  },

  logout: async () => {
    await api.post("/api/v1/auth/logout");
  },

  getMe: async () => {
    const res = await api.get("/api/v1/auth/me");
    return res.data;
  },
};
