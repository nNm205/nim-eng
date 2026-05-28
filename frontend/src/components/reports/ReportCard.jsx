import { FileText, BarChart3, ClipboardList, ArrowRight, Trash2 } from "lucide-react";

const ReportCard = ({ report, onClick, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const typeLabels = {
    literature_review: "Tổng quan tài liệu",
    data_analysis: "Phân tích dữ liệu",
    research_summary: "Tóm tắt nghiên cứu",
    custom: "Tùy chỉnh",
  };

  const statusConfig = {
    draft: { label: "Nháp", color: "bg-amber-100 text-amber-700" },
    published: { label: "Đã xuất bản", color: "bg-emerald-100 text-emerald-700" },
    archived: { label: "Lưu trữ", color: "bg-slate-100 text-slate-700" }
  };

  const status = statusConfig[report.status] || statusConfig.draft;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={onClick}
          className="flex-1 text-left group hover:text-teal-600"
        >
          <div className="flex items-start gap-3 flex-1">
            <span className="text-3xl flex-shrink-0">📊</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition-colors mb-1 truncate">
                {report.title}
              </h3>
              <p className="text-sm text-slate-500">{typeLabels[report.report_type]}</p>
            </div>
          </div>
        </button>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Content Preview */}
      {report.content && (
        <button
          onClick={onClick}
          className="w-full text-left text-sm text-slate-600 mb-4 line-clamp-2 hover:text-teal-600 transition-colors"
        >
          {report.content.substring(0, 150)}...
        </button>
      )}

      {/* Documents Info */}
      {report.included_documents && report.included_documents.length > 0 && (
        <button
          onClick={onClick}
          className="w-full text-left mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-colors"
        >
          <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Tài liệu đính kèm:
          </p>
          <p className="text-sm text-slate-600">
            {report.included_documents.length} tài liệu
          </p>
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-500">{formatDate(report.updated_at)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClick}
            className="text-teal-600 hover:text-teal-700 transition-colors p-1 hover:bg-teal-50 rounded-lg"
            title="Xem chi tiết"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(report.id);
              }}
              className="text-red-600 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;