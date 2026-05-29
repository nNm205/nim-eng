import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { knowledgeBaseService } from "../services/knowledgeBaseService";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Calendar,
  Tag,
  Beaker,
  BarChart3,
  Zap,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
  research: Beaker,
  analysis: BarChart3,
  methodology: Zap,
  tools: Wrench,
  general: BookOpen,
};

const CATEGORY_LABELS = {
  research: "Nghiên cứu",
  analysis: "Phân tích",
  methodology: "Phương pháp",
  tools: "Công cụ",
  general: "Tổng hợp",
};

const CATEGORY_COLORS = {
  research:    { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   icon: "text-blue-600"   },
  analysis:    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "text-purple-600" },
  methodology: { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  icon: "text-amber-600"  },
  tools:       { bg: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700",icon: "text-emerald-600"},
  general:     { bg: "bg-slate-50",  border: "border-slate-200",  text: "text-slate-700",  icon: "text-slate-600"  },
};

const SUBMISSION_STATUS = {
  pending:  { label: "Chờ duyệt",   color: "bg-amber-100 text-amber-700",   icon: Clock        },
  approved: { label: "Đã duyệt",    color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Bị từ chối",  color: "bg-red-100 text-red-700",       icon: AlertCircle  },
};

const CATEGORY_OPTIONS = ["research", "analysis", "methodology", "tools", "general"];

// ─── Submit Modal ─────────────────────────────────────────────────────────────

const SubmitArticleModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "research",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể gửi bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Gửi bài viết</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={5}
              maxLength={500}
              value={form.title}
              onChange={handleChange}
              placeholder="Tiêu đề bài viết..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tóm tắt <span className="text-red-500">*</span>
            </label>
            <textarea
              name="excerpt"
              required
              rows={3}
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Mô tả ngắn gọn nội dung bài viết..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={8}
              value={form.content}
              onChange={handleChange}
              placeholder="Nội dung chi tiết của bài viết..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="AI, Research, Methods..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Đang gửi..." : "Gửi bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── My Submissions Panel ─────────────────────────────────────────────────────

const MySubmissionsPanel = ({ submissions, loading }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-teal-600" />
          <span className="font-semibold text-slate-900">Bài viết đã gửi của tôi</span>
          {submissions.length > 0 && (
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full">
              {submissions.length}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-200 divide-y divide-slate-100">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Bạn chưa gửi bài viết nào
            </div>
          ) : (
            submissions.map((sub) => {
              const cfg = SUBMISSION_STATUS[sub.status] || SUBMISSION_STATUS.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={sub.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{sub.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(sub.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      {sub.status === "rejected" && sub.rejection_reason && (
                        <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg">
                          <span className="font-semibold">Lý do từ chối:</span>{" "}
                          {sub.rejection_reason}
                        </p>
                      )}
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${cfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const KnowledgeBasePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.is_admin;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Submit modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // My submissions
  const [mySubmissions, setMySubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!isAdmin) loadMySubmissions();
  }, [isAdmin]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await knowledgeBaseService.getArticles(
        selectedCategory,
        searchQuery || null
      );
      setArticles(data.articles);
      setCategories(data.categories);
      setError("");
    } catch (err) {
      setError("Không thể tải bài viết");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMySubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const data = await knowledgeBaseService.getMySubmissions();
      setMySubmissions(data.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleSubmitArticle = async (payload) => {
    await knowledgeBaseService.submitArticle(payload);
    setShowSubmitModal(false);
    setMessage({ type: "success", text: "Bài viết đã được gửi và đang chờ Admin duyệt!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    loadMySubmissions();
  };

  const categoryList = [
    { id: "all", name: "Tất cả", icon: BookOpen },
    ...Object.entries(categories).map(([key, count]) => ({
      id: key,
      name: CATEGORY_LABELS[key] || key,
      count,
      icon: CATEGORY_ICONS[key] || BookOpen,
    })),
  ];

  const stats = {
    total: articles.length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    categoryCount: Object.keys(categories).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Knowledge Base</h1>
            <p className="text-slate-600 mt-2">
              Thư viện tài liệu hướng dẫn và kiến thức hữu ích về nghiên cứu học thuật
            </p>
          </div>
          {/* Admin: tạo trực tiếp | User: gửi bài chờ duyệt */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>{isAdmin ? "Thêm bài viết" : "Gửi bài viết"}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Tổng số bài viết" value={stats.total}        icon={BookOpen} color="teal"    />
          <StatCard title="Lượt xem"          value={stats.totalViews}   icon={Eye}      color="emerald" />
          <StatCard title="Danh mục"          value={stats.categoryCount} icon={Tag}      color="slate"   />
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {message.text && (
          <div className={`flex items-start gap-3 px-6 py-4 rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* My Submissions (user only) */}
        {!isAdmin && (
          <MySubmissionsPanel
            submissions={mySubmissions}
            loading={submissionsLoading}
          />
        )}

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, từ khóa..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? "bg-white/30" : "bg-slate-100"
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Đang tải bài viết...</p>
          </div>
        )}

        {/* Articles */}
        {!loading && (
          articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-slate-600 mb-8">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Xóa tìm kiếm
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <SubmitArticleModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmitArticle}
        />
      )}
    </DashboardLayout>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    teal:    "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    slate:   "from-slate-50 to-slate-100",
  };
  const iconColorClasses = {
    teal:    "text-teal-600",
    emerald: "text-emerald-600",
    slate:   "text-slate-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:shadow-md transition-all`}>
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  const colors = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general;
  const IconComponent = CATEGORY_ICONS[article.category] || BookOpen;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            {article.creator && (
              <span className="text-xs text-slate-400">
                · {article.creator.full_name || article.creator.email}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium ml-4 flex-shrink-0">
          <Eye className="w-4 h-4" />
          <span>{article.views}</span>
        </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-200">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(article.updated_at).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <button className="text-teal-600 hover:text-teal-700 transition-colors p-1 hover:bg-teal-50 rounded-lg font-semibold text-sm">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
