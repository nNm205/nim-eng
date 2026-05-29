import api from "./api";

export const knowledgeBaseService = {
  // ─── Articles (public read) ───────────────────────────────────────────────

  getArticles: async (category = null, search = null, skip = 0, limit = 50) => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    params.append("skip", skip);
    params.append("limit", limit);

    const res = await api.get(`/api/v1/knowledge-base/articles?${params.toString()}`);
    return res.data;
  },

  getArticle: async (articleId) => {
    const res = await api.get(`/api/v1/knowledge-base/articles/${articleId}`);
    return res.data;
  },

  // ─── Articles (admin only) ────────────────────────────────────────────────

  createArticle: async (articleData) => {
    const res = await api.post(`/api/v1/knowledge-base/articles`, articleData);
    return res.data;
  },

  updateArticle: async (articleId, updateData) => {
    const res = await api.put(`/api/v1/knowledge-base/articles/${articleId}`, updateData);
    return res.data;
  },

  deleteArticle: async (articleId) => {
    await api.delete(`/api/v1/knowledge-base/articles/${articleId}`);
  },

  // ─── Submissions (user) ───────────────────────────────────────────────────

  // User submit bài viết để chờ duyệt
  submitArticle: async (submissionData) => {
    const res = await api.post(`/api/v1/knowledge-base/submissions`, submissionData);
    return res.data;
  },

  // User xem lịch sử submissions của mình
  getMySubmissions: async (skip = 0, limit = 50) => {
    const params = new URLSearchParams();
    params.append("skip", skip);
    params.append("limit", limit);

    const res = await api.get(`/api/v1/knowledge-base/submissions/my?${params.toString()}`);
    return res.data;
  },

  // ─── Submissions (admin) ──────────────────────────────────────────────────

  // Admin xem danh sách chờ duyệt
  getPendingSubmissions: async (skip = 0, limit = 50) => {
    const params = new URLSearchParams();
    params.append("skip", skip);
    params.append("limit", limit);

    const res = await api.get(`/api/v1/knowledge-base/submissions/pending?${params.toString()}`);
    return res.data;
  },

  // Admin duyệt bài viết
  approveSubmission: async (submissionId) => {
    const res = await api.post(`/api/v1/knowledge-base/submissions/${submissionId}/approve`);
    return res.data;
  },

  // Admin từ chối bài viết
  rejectSubmission: async (submissionId, rejectionReason) => {
    const res = await api.post(`/api/v1/knowledge-base/submissions/${submissionId}/reject`, {
      rejection_reason: rejectionReason,
    });
    return res.data;
  },
};
