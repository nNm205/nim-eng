import { FileText, BarChart3, ClipboardList, ArrowRight, Trash2 } from "lucide-react";

const ProjectCard = ({ project, onClick, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusColors = {
    active: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", label: "Đang hoạt động" },
    completed: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "Hoàn thành" },
    on_hold: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Tạm dừng" },
    cancelled: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Đã hủy" },
  };

  const statusConfig = statusColors[project.status] || statusColors.active;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={onClick}
          className="flex-1 text-left group hover:text-teal-600"
        >
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
            {project.name}
          </h3>
          {project.topic && (
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <span className="text-teal-600">📌</span>
              {project.topic}
            </p>
          )}
        </button>
        {project.is_archived && (
          <span className="flex-shrink-0 bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-lg font-medium ml-2">
            📦 Lưu trữ
          </span>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <button
          onClick={onClick}
          className="w-full text-left text-sm text-slate-600 mb-4 line-clamp-2 hover:text-teal-600 transition-colors"
        >
          {project.description}
        </button>
      )}

      {/* Research Scope Preview */}
      {project.research_scope && (
        <button
          onClick={onClick}
          className="w-full text-left mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition-colors"
        >
          <p className="text-xs font-semibold text-slate-700 mb-1">Phạm vi nghiên cứu:</p>
          <p className="text-sm text-slate-600 line-clamp-2">
            {project.research_scope}
          </p>
        </button>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-600 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span className="font-semibold">{project.documents?.length || 0}</span>
        </button>
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-600 transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="font-semibold">{project.research_sessions?.length || 0}</span>
        </button>
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="font-semibold">{project.reports?.length || 0}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`${statusConfig.bg} border ${statusConfig.border} text-xs px-3 py-1.5 rounded-lg font-semibold ${statusConfig.text}`}>
          {statusConfig.label}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {formatDate(project.updated_at)}
          </span>
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
                onDelete(project.id);
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

export default ProjectCard;