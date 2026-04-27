import api from "./api";

export const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  // Gọi khi app khởi động để verify cookie còn hợp lệ
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
