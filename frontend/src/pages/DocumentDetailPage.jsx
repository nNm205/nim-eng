import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { documentService } from "../services/documentService";
import { projectService } from "../services/projectService";
import {
  ArrowLeft, Trash2, Edit2, CheckCircle2, Clock, Link2,
  AlertCircle, FileText, Globe, GraduationCap, Upload, BookOpen, ExternalLink
} from "lucide-react";

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

  useEffect(() => { loadData(); }, [documentId, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [proj, doc] = await Promise.all([
        projectService.getProject(projectId),
        documentService.getDocument(projectId, documentId),
      ]);
      setProject(proj);
      setDocument(doc);
      setFormData({
        title: doc.title,
        source_url: doc.source_url || "",
        source_type: doc.source_type || "web",
        content: doc.content || "",
      });
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
      const updated = await documentService.updateDocument(projectId, documentId, formData);
      setDocument(updated);
      setMessage({ type: "success", text: "Cập nhật tài liệu thành công!" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể cập nhật tài liệu");
    } finally {
      setApiLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này? Hành động này không thể hoàn tác.")) return;
    setApiLoading(true);
    try {
      await documentService.deleteDocument(projectId, documentId);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể xóa tài liệu");
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const sourceTypes = [
    { value: "web",      label: "Trang web",  icon: Globe },
    { value: "academic", label: "Học thuật",  icon: GraduationCap },
    { value: "uploaded", label: "Tải lên",    icon: Upload },
    { value: "pdf",      label: "PDF",        icon: BookOpen },
  ];

  const getSourceTypeConfig = (sourceType) =>
    sourceTypes.find(t => t.value === sourceType) || { label: sourceType, icon: FileText };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
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
          <button onClick={() => navigate(`/projects/${projectId}`)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
            Quay lại Dự án
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const sourceCfg = getSourceTypeConfig(document.source_type);
  const SourceIcon = sourceCfg.icon;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <button onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {project.name}
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">{document.title}</span>
        </div>

        {message.text && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />{message.text}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />{error}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
                      <SourceIcon className="w-7 h-7 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{document.title}</h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-600 uppercase bg-slate-100 px-3 py-1.5 rounded-lg">
                          {sourceCfg.label}
                        </span>
                        {document.processed ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /><span>Đã xử lý</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /><span>Chưa xử lý</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source URL */}
                {document.source_url && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">URL Nguồn</h3>
                    <a href={document.source_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors w-full">
                      <Link2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-blue-600 hover:text-blue-700 break-all font-medium flex-1">{document.source_url}</span>
                    </a>
                  </div>
                )}

                {/* Document Viewer — embed source_url */}
                {document.source_url && <DocumentViewer url={document.source_url} />}

                {/* Fallback: plain text if no source_url */}
                {!document.source_url && document.content && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Nội dung</h3>
                    <div className="bg-slate-50 rounded-xl p-6 max-h-[600px] overflow-y-auto border border-slate-200">
                      <p className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{document.content}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wide">Thông tin</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Trạng thái xử lý</p>
                      <p className="text-sm font-semibold text-slate-900">{document.processed ? "Đã xử lý" : "Chưa xử lý"}</p>
                    </div>
                    {document.relevance_score != null && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-xs font-semibold text-slate-600 mb-3">Độ liên quan</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                              style={{ width: `${document.relevance_score * 100}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                            {(document.relevance_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Ngày tạo</p>
                      <p className="text-sm text-slate-700 font-medium">{formatDate(document.created_at)}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Cập nhật lần cuối</p>
                      <p className="text-sm text-slate-700 font-medium">{formatDate(document.updated_at)}</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">ID</p>
                      <p className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 truncate">{document.id}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-3">
                  <button onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                    <Edit2 className="w-4 h-4" />Chỉnh sửa
                  </button>
                  <button onClick={handleDelete} disabled={apiLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors rounded-xl disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />Xóa tài liệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Chỉnh sửa tài liệu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Loại nguồn</label>
                <div className="grid grid-cols-2 gap-3">
                  {sourceTypes.map(({ value, label, icon: Icon }) => {
                    const active = formData.source_type === value;
                    return (
                      <button key={value} type="button" onClick={() => setFormData({ ...formData, source_type: value })}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${active ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                        <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-teal-600" : "text-slate-400"}`} />
                        <span className={`text-sm font-semibold ${active ? "text-teal-700" : "text-slate-700"}`}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">URL nguồn</label>
                <input type="url" name="source_url" value={formData.source_url} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors">Hủy</button>
                <button type="submit" disabled={apiLoading}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
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

/**
 * DocumentViewer — nhúng source_url vào iframe để hiển thị đúng format.
 * - arxiv.org/abs/... → chuyển sang arxiv.org/pdf/...
 * - *.pdf → dùng Google Docs Viewer
 * - còn lại → nhúng trực tiếp, fallback nếu bị chặn
 */
const DocumentViewer = ({ url }) => {
  const [viewerError, setViewerError] = useState(false);

  const getEmbedUrl = (rawUrl) => {
    const arxivAbsMatch = rawUrl.match(/arxiv\.org\/abs\/(.+)/);
    if (arxivAbsMatch) return `https://arxiv.org/pdf/${arxivAbsMatch[1]}`;
    if (rawUrl.toLowerCase().includes(".pdf"))
      return `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
    return rawUrl;
  };

  const embedUrl = getEmbedUrl(url);
  const isPdf = url.toLowerCase().includes(".pdf") || url.includes("arxiv.org/abs/") || url.includes("arxiv.org/pdf/");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          {isPdf ? "Xem tài liệu PDF" : "Xem trang nguồn"}
        </h3>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors">
          <ExternalLink className="w-4 h-4" />Mở tab mới
        </a>
      </div>

      {viewerError ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">Không thể nhúng trang này</p>
          <p className="text-slate-500 text-sm mb-5">Trang web chặn hiển thị trong iframe.</p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors">
            <ExternalLink className="w-4 h-4" />Mở tài liệu
          </a>
        </div>
      ) : (
        <iframe src={embedUrl} title="Document viewer" className="w-full border-0"
          style={{ height: "80vh" }}
          onError={() => setViewerError(true)}
          onLoad={(e) => {
            try {
              if (!e.target.contentDocument && !e.target.contentWindow) setViewerError(true);
            } catch { /* cross-origin — fine */ }
          }}
        />
      )}
    </div>
  );
};

export default DocumentDetailPage;
