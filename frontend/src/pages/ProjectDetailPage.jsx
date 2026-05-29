import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../services/projectService";
import { ArrowLeft, Trash2, Archive, ArchiveRestore, Edit2, Calendar, CheckCircle2, AlertCircle, FileText, BarChart3, ClipboardList } from "lucide-react";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProject(projectId);
      setProject(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        topic: data.topic || "",
        research_scope: data.research_scope || "",
        status: data.status,
      });
      setError("");
    } catch (err) {
      setError("Không thể tải thông tin dự án");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiLoading(true);
    setError("");

    try {
      const updated = await projectService.updateProject(projectId, formData);
      setProject(updated);
      setFormData({
        name: updated.name,
        description: updated.description || "",
        topic: updated.topic || "",
        research_scope: updated.research_scope || "",
        status: updated.status,
      });
      setIsEditing(false);
      setMessage({ type: "success", text: "Cập nhật dự án thành công!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể cập nhật dự án");
    } finally {
      setApiLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArchive = async () => {
    setApiLoading(true);
    try {
      const updated = await projectService.updateProject(projectId, { is_archived: !project.is_archived });
      setProject(updated);
      setMessage({ 
        type: "success", 
        text: project.is_archived ? "Bỏ lưu trữ dự án thành công!" : "Lưu trữ dự án thành công!" 
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể cập nhật trạng thái");
    } finally {
      setApiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này? Hành động này không thể hoàn tác.")) return;
    
    setApiLoading(true);
    try {
      await projectService.deleteProject(projectId);
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể xóa dự án");
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    { value: "active", label: "Đang hoạt động" },
    { value: "completed", label: "Hoàn thành" },
    { value: "on_hold", label: "Tạm dừng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const statusColors = {
    active: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    completed: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    on_hold: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    cancelled: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải dự án...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy dự án</h2>
          <p className="text-slate-600 mb-8">Dự án bạn tìm không tồn tại hoặc đã bị xóa</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Quay lại Dự án
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = statusColors[project.status] || statusColors.active;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Dự án
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">{project.name}</span>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {message.text && (
          <div
            className={`border rounded-xl px-6 py-4 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">
                    {project.name}
                  </h1>
                  {project.topic && (
                    <p className="text-slate-600 flex items-center gap-2 text-base">
                      <span className="text-teal-600 text-lg">📌</span>
                      {project.topic}
                    </p>
                  )}
                </div>
                {project.is_archived && (
                  <span className="flex-shrink-0 bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-lg font-medium">
                    📦 Đã lưu trữ
                  </span>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {project.description && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal-600"></span>
                      Mô tả
                    </h2>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Research Scope */}
                {project.research_scope && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal-600"></span>
                      Phạm vi nghiên cứu
                    </h2>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">
                      {project.research_scope}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <StatItem
                    icon={FileText}
                    value={project.documents?.length || 0}
                    label="Tài liệu"
                  />
                  <StatItem
                    icon={BarChart3}
                    value={project.research_sessions?.length || 0}
                    label="Phân tích"
                  />
                  <StatItem
                    icon={ClipboardList}
                    value={project.reports?.length || 0}
                    label="Báo cáo"
                  />
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Thông tin</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Trạng thái</p>
                      <span className={`inline-block text-sm font-bold px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusOptions.find(s => s.value === project.status)?.label}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày tạo
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(project.created_at)}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Cập nhật lần cuối
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(project.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>

                  <button
                    onClick={handleArchive}
                    disabled={apiLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors disabled:opacity-50"
                  >
                    {project.is_archived ? (
                      <>
                        <ArchiveRestore className="w-4 h-4" />
                        Bỏ lưu trữ
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Lưu trữ
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={apiLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors rounded-xl disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa dự án
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Chỉnh sửa dự án</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tên dự án <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  minLength={3}
                  maxLength={255}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Chủ đề
                </label>
                <input
                  type="text"
                  name="topic"
                  maxLength={500}
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Research Scope */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Phạm vi nghiên cứu
                </label>
                <textarea
                  name="research_scope"
                  rows={5}
                  value={formData.research_scope}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={apiLoading}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  {apiLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatItem = ({ icon: Icon, value, label }) => {
  return (
    <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
      <Icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
    </div>
  );
};

export default ProjectDetailsPage;