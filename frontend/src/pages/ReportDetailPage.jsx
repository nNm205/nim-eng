import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { reportService } from "../services/reportService";
import {
  ArrowLeft,
  Trash2,
  Archive,
  ArchiveRestore,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Download,
} from "lucide-react";

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      // Mock data - thay thế bằng API thực tế
      const data = {
        id: reportId,
        title: "Báo cáo phân tích thị trường AI 2024",
        report_type: "research_summary",
        content: "Nội dung chi tiết của báo cáo...",
        status: "published",
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        included_documents: [
          { id: 1, name: "AI Market Analysis" },
          { id: 2, name: "Trend Analysis" },
        ],
        project_id: 1,
      };
      
      setReport(data);
      setFormData({
        title: data.title,
        report_type: data.report_type,
        content: data.content || "",
        status: data.status,
      });
      setError("");
    } catch (err) {
      setError("Không thể tải thông tin báo cáo");
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
      const updated = await reportService.updateReport(reportId, formData);
      setMessage({ type: "success", text: "Cập nhật báo cáo thành công!" });
      setReport(updated);
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError("Không thể cập nhật báo cáo");
      console.error(err);
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
      const updated = await reportService.updateReport(reportId, {
        is_archived: !report.is_archived,
      });
      setReport(updated);
      setMessage({
        type: "success",
        text: report.is_archived
          ? "Bỏ lưu trữ báo cáo thành công!"
          : "Lưu trữ báo cáo thành công!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setError("Không thể cập nhật trạng thái");
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa báo cáo này? Hành động này không thể hoàn tác."
      )
    )
      return;

    setApiLoading(true);
    try {
      await reportService.deleteReport(reportId);
      navigate("/reports");
    } catch (err) {
      setError("Không thể xóa báo cáo");
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const reportTypeLabels = {
    literature_review: "Tổng quan tài liệu",
    data_analysis: "Phân tích dữ liệu",
    research_summary: "Tóm tắt nghiên cứu",
    custom: "Tùy chỉnh",
  };

  const statusOptions = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Đã xuất bản" },
    { value: "archived", label: "Lưu trữ" },
  ];

  const statusColors = {
    draft: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    published: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    archived: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải báo cáo...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Không tìm thấy báo cáo
          </h2>
          <p className="text-slate-600 mb-8">
            Báo cáo bạn tìm không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={() => navigate("/reports")}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Quay lại Báo cáo
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = statusColors[report.status] || statusColors.draft;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Báo cáo
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold truncate">{report.title}</span>
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

        {/* Main Content */}
        {!isEditing ? (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">
                    {report.title}
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {reportTypeLabels[report.report_type] || report.report_type}
                  </p>
                </div>
                {report.is_archived && (
                  <span className="flex-shrink-0 bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-lg font-medium ml-2">
                    📦 Đã lưu trữ
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Content Card */}
                {report.content && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-1 h-8 rounded-full bg-gradient-to-b from-teal-600 to-teal-700"></span>
                      Nội dung báo cáo
                    </h2>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">
                      {report.content}
                    </p>
                  </div>
                )}

                {!report.content && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 italic">
                      Báo cáo này chưa có nội dung
                    </p>
                  </div>
                )}

                {/* Documents Card */}
                {report.included_documents && report.included_documents.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      Tài liệu đính kèm ({report.included_documents.length})
                    </h3>
                    <div className="space-y-3">
                      {report.included_documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-teal-600" />
                            <div>
                              <p className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                                {doc.name}
                              </p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wide">
                    Thông tin
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Loại báo cáo</p>
                      <div className="px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                        <p className="text-sm font-medium text-teal-700">
                          {reportTypeLabels[report.report_type]}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Trạng thái</p>
                      <span
                        className={`inline-block text-sm font-bold px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        {statusOptions.find((s) => s.value === report.status)?.label}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày tạo
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(report.created_at)}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Cập nhật lần cuối
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        {formatDate(report.updated_at)}
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
                    {report.is_archived ? (
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
                    Xóa báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Chỉnh sửa báo cáo</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tiêu đề báo cáo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  minLength={3}
                  maxLength={255}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Loại báo cáo
                </label>
                <select
                  name="report_type"
                  value={formData.report_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
                >
                  <option value="research_summary">Tóm tắt nghiên cứu</option>
                  <option value="literature_review">Tổng quan tài liệu</option>
                  <option value="data_analysis">Phân tích dữ liệu</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>
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

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  rows={10}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none"
                  placeholder="Nhập nội dung chi tiết của báo cáo..."
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

export default ReportDetailPage;