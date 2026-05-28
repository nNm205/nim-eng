import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { documentService } from "../services/documentService";
import { projectService } from "../services/projectService";
import { ArrowLeft, Trash2, Edit2, CheckCircle2, Clock, Link2, AlertCircle, FileText } from "lucide-react";

const DocumentDetailPage = () => {
  const { projectId, documentId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadData();
  }, [documentId, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load project
      const projectsData = await projectService.getProjects();
      const proj = projectsData.find(p => p.id === projectId);
      setProject(proj);

      // Load document
      const docData = await documentService.getProjectDocuments(projectId);
      const doc = docData.find(d => d.id === documentId);
      if (doc) {
        setDocument(doc);
        setFormData({
          title: doc.title,
          source_url: doc.source_url || "",
          source_type: doc.source_type || "text",
          content: doc.content || "",
        });
      }
      setError("");
    } catch (err) {
      setError("Không thể tải thông tin tài liệu");
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
      const updated = await documentService.updateDocument(
        projectId,
        documentId,
        formData
      );
      setDocument(updated);
      setMessage({ type: "success", text: "Cập nhật tài liệu thành công!" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError("Không thể cập nhật tài liệu");
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

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này? Hành động này không thể hoàn tác.")) return;
    
    setApiLoading(true);
    try {
      await documentService.deleteDocument(projectId, documentId);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError("Không thể xóa tài liệu");
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

  const sourceTypes = [
    { value: "text", label: "📝 Văn bản" },
    { value: "url", label: "🔗 URL" },
    { value: "pdf", label: "📕 PDF" },
    { value: "upload", label: "📤 Upload" },
  ];

  const getSourceTypeLabel = (sourceType) => {
    return sourceTypes.find(t => t.value === sourceType)?.label || sourceType;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải tài liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!document || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy tài liệu</h2>
          <p className="text-slate-600 mb-8">Tài liệu bạn tìm không tồn tại hoặc đã bị xóa</p>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Quay lại Dự án
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {project.name}
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">{document.title}</span>
        </div>

        {/* Success Message */}
        {message.text && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {message.text}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Document Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-5xl">
                        {document.source_type === "pdf" ? "📕" : 
                         document.source_type === "url" ? "🔗" : 
                         document.source_type === "upload" ? "📤" : "📝"}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                          {document.title}
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block text-sm font-semibold text-slate-600 uppercase bg-slate-100 px-3 py-1.5 rounded-lg">
                            {getSourceTypeLabel(document.source_type)}
                          </span>
                          {document.processed ? (
                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã xử lý</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Chưa xử lý</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source URL */}
                {document.source_url && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">URL Nguồn</h3>
                    <a
                      href={document.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors w-full"
                    >
                      <Link2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-blue-600 hover:text-blue-700 break-all font-medium flex-1">
                        {document.source_url}
                      </span>
                    </a>
                  </div>
                )}

                {/* Content */}
                {document.content && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Nội dung</h3>
                    <div className="bg-slate-50 rounded-xl p-6 max-h-[600px] overflow-y-auto border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {document.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* File Path */}
                {document.file_path && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Đường dẫn File</h3>
                    <p className="text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 break-all">
                      {document.file_path}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Metadata & Actions */}
              <div className="space-y-6">
                {/* Metadata Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wide">Thông tin</h3>
                  
                  <div className="space-y-4">
                    {/* Status */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Trạng thái xử lý</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {document.processed ? "Đã xử lý" : "Chưa xử lý"}
                      </p>
                    </div>

                    {/* Relevance Score */}
                    {document.relevance_score !== null && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-xs font-semibold text-slate-600 mb-3">Độ liên quan</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                              style={{ width: `${document.relevance_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                            {(document.relevance_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Ngày tạo</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(document.created_at)}
                      </p>
                    </div>

                    {/* Updated Date */}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Cập nhật lần cuối</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(document.created_at)}
                      </p>
                    </div>

                    {/* ID */}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">ID</p>
                      <p className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 truncate">
                        {document.id}
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
                    onClick={handleDelete}
                    disabled={apiLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors rounded-xl disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa tài liệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Chỉnh sửa tài liệu</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                />
              </div>

              {/* Source Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Loại nguồn
                </label>
                <select
                  name="source_type"
                  value={formData.source_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                >
                  {sourceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  URL nguồn
                </label>
                <input
                  type="url"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none font-mono text-sm"
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

export default DocumentDetailPage;