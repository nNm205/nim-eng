import { useState } from "react";
import { X, CheckCircle2, Loader } from "lucide-react";

const StartAnalysisModal = ({ documents, onClose, onStart }) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDocumentId) {
      setError("Vui lòng chọn tài liệu");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onStart(selectedDocumentId);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Không thể bắt đầu phân tích"
      );
    } finally {
      setLoading(false);
    }
  };

  const processedDocs = documents.filter((d) => d.processed);
  const unprocessedDocs = documents.filter((d) => !d.processed);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bắt đầu phân tích</h2>
            <p className="text-sm text-slate-600 mt-1">
              Chọn tài liệu để phân tích bằng AI
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Document Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Chọn tài liệu để phân tích{" "}
              <span className="text-red-500">*</span>
            </label>

            {processedDocs.length === 0 && unprocessedDocs.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-600">Không có tài liệu nào</p>
              </div>
            )}

            {/* Processed Documents */}
            {processedDocs.length > 0 && (
              <div className="space-y-2 mb-6">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                  Đã xử lý ({processedDocs.length})
                </p>
                {processedDocs.map((doc) => (
                  <DocumentOption
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDocumentId === doc.id}
                    onSelect={(id) => setSelectedDocumentId(id)}
                    status="processed"
                  />
                ))}
              </div>
            )}

            {/* Unprocessed Documents */}
            {unprocessedDocs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                  Chưa xử lý ({unprocessedDocs.length})
                </p>
                {unprocessedDocs.map((doc) => (
                  <DocumentOption
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDocumentId === doc.id}
                    onSelect={(id) => setSelectedDocumentId(id)}
                    status="unprocessed"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-teal-900">
                <p className="font-semibold mb-3">
                  Phân tích sẽ cung cấp:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span>Tóm tắt nội dung chính</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span>Trích xuất các thực thể quan trọng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span>Từ khóa chính và chủ đề</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span>Phân tích cảm xúc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span>Các phát hiện và insight quan trọng</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Processing Time Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">💡 Mẹo:</span> Thời gian xử lý
              thường mất 2-5 phút tùy theo độ dài của tài liệu
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDocumentId}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Đang bắt đầu...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Bắt đầu phân tích</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DocumentOption = ({ doc, isSelected, onSelect, status }) => {
  return (
    <label
      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? "border-teal-500 bg-teal-50"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type="radio"
        name="document"
        value={doc.id}
        checked={isSelected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-5 h-5 text-teal-600 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900">{doc.title}</p>
        {doc.source_type && (
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {doc.source_type}
          </p>
        )}
      </div>
      {status === "processed" ? (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg flex-shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Sẵn sàng</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg flex-shrink-0">
          <Loader className="w-4 h-4" />
          <span className="text-xs font-semibold">Xử lý...</span>
        </div>
      )}
    </label>
  );
};

export default StartAnalysisModal;