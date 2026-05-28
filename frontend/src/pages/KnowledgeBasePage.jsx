import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
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
} from "lucide-react";

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - sẽ được thay thế bằng API call
  const categories = [
    { id: "all", name: "Tất cả", count: 24, icon: BookOpen },
    { id: "research", name: "Nghiên cứu", count: 8, icon: Beaker },
    { id: "analysis", name: "Phân tích", count: 6, icon: BarChart3 },
    { id: "methodology", name: "Phương pháp", count: 5, icon: Zap },
    { id: "tools", name: "Công cụ", count: 5, icon: Wrench },
  ];

  const articles = [
    {
      id: 1,
      title: "Hướng dẫn sử dụng AI Agents cho nghiên cứu",
      category: "research",
      excerpt:
        "Tìm hiểu cách sử dụng các AI agents để tự động hóa quy trình nghiên cứu của bạn...",
      tags: ["AI", "Research", "Automation"],
      views: 245,
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      title: "Phương pháp phân tích dữ liệu định tính",
      category: "methodology",
      excerpt:
        "Các bước và kỹ thuật để phân tích dữ liệu định tính một cách hiệu quả...",
      tags: ["Qualitative", "Analysis", "Methods"],
      views: 189,
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      title: "Tối ưu hóa quy trình tạo báo cáo",
      category: "tools",
      excerpt:
        "Sử dụng templates và automation để tạo báo cáo nhanh chóng và chuyên nghiệp...",
      tags: ["Reports", "Templates", "Productivity"],
      views: 312,
      lastUpdated: "2024-01-13",
    },
    {
      id: 4,
      title: "Kỹ thuật trích xuất thông tin từ tài liệu",
      category: "analysis",
      excerpt:
        "Các phương pháp và công cụ để trích xuất thông tin quan trọng từ tài liệu nghiên cứu...",
      tags: ["NLP", "Extraction", "Documents"],
      views: 278,
      lastUpdated: "2024-01-12",
    },
    {
      id: 5,
      title: "Best Practices trong viết báo cáo nghiên cứu",
      category: "methodology",
      excerpt:
        "Hướng dẫn chi tiết về cấu trúc, nội dung và cách trình bày báo cáo chuyên nghiệp...",
      tags: ["Reports", "Writing", "Academic"],
      views: 156,
      lastUpdated: "2024-01-11",
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: articles.length,
    byCategory: categories.filter((c) => c.id !== "all").map((c) => c.count),
    totalViews: articles.reduce((sum, article) => sum + article.views, 0),
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
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            <span>Thêm bài viết</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Tổng số bài viết"
            value={stats.total}
            icon={BookOpen}
            color="teal"
          />
          <StatCard
            title="Lượt xem"
            value={stats.totalViews}
            icon={Eye}
            color="emerald"
          />
          <StatCard
            title="Danh mục"
            value={categories.filter((c) => c.id !== "all").length}
            icon={Tag}
            color="slate"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, từ khóa..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md hover:shadow-lg"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-white/30"
                      : "bg-slate-100"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    teal: "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    slate: "from-slate-50 to-slate-100",
  };

  const iconColorClasses = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    slate: "text-slate-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:shadow-md transition-all`}
        >
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  const categoryColors = {
    research: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600",
    },
    analysis: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      icon: "text-purple-600",
    },
    methodology: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-600",
    },
    tools: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
  };

  const categoryIcons = {
    research: Beaker,
    analysis: BarChart3,
    methodology: Zap,
    tools: Wrench,
  };

  const colors = categoryColors[article.category] || categoryColors.research;
  const IconComponent = categoryIcons[article.category] || BookOpen;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}
            >
              <IconComponent className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}
            >
              {article.category}
            </span>
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

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(article.lastUpdated).toLocaleDateString("vi-VN", {
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