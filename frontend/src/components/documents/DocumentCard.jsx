import { FileText, Link2, CheckCircle2, Clock } from "lucide-react";

const DocumentCard = ({ document, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSourceTypeIcon = (sourceType) => {
    const icons = {
      pdf: "📕",
      url: "🔗",
      text: "📝",
      upload: "📤",
    };
    return icons[sourceType] || "📄";
  };

  const getSourceTypeLabel = (sourceType) => {
    const labels = {
      pdf: "PDF",
      url: "URL",
      text: "Văn bản",
      upload: "Upload",
    };
    return labels[sourceType] || sourceType;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="text-3xl flex-shrink-0">
            {getSourceTypeIcon(document.source_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2 line-clamp-2">
              {document.title}
            </h3>
            {document.source_type && (
              <span className="inline-block text-xs font-semibold text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-lg">
                {getSourceTypeLabel(document.source_type)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
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

      {/* Content Preview */}
      {document.content && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors">
          {truncateText(document.content)}
        </p>
      )}

      {/* Source URL */}
      {document.source_url && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
          <a
            href={document.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate flex items-center gap-2"
          >
            <Link2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{document.source_url}</span>
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4">
          {document.relevance_score !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Độ liên quan:</span>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                    style={{ width: `${document.relevance_score * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-900 w-6 text-right">
                  {(document.relevance_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {formatDate(document.created_at)}
        </span>
      </div>
    </div>
  );
};

export default DocumentCard;