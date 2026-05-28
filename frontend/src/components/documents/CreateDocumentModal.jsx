import { useState } from "react";
import { X } from "lucide-react";

const CreateDocumentModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    source_url: "",
    source_type: "text",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onCreate(formData);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể tạo tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sourceTypes = [
    { value: "text", label: "📝 Văn bản" },
    { value: "url", label: "🔗 URL" },
    { value: "pdf", label: "📕 PDF" },
    { value: "upload", label: "📤 Upload" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Thêm tài liệu mới</h2>
            <p className="text-sm text-slate-600 mt-1">
              Thêm tài liệu vào dự án nghiên cứu của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

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
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
              placeholder="Ví dụ: Báo cáo nghiên cứu thị trường AI"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
            >
              {sourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Chọn loại nguồn của tài liệu
            </p>
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              URL nguồn <span className="text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <input
              type="url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
              placeholder="https://example.com/document.pdf"
            />
            <p className="text-xs text-slate-500 mt-2">
              Link đến tài liệu gốc (nếu có)
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nội dung <span className="text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <textarea
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none font-mono text-sm text-slate-900"
              placeholder="Nhập hoặc paste nội dung tài liệu..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Nội dung văn bản của tài liệu
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
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
              {loading ? "Đang thêm..." : "Thêm tài liệu"}
            </button>
          </div>
        </form>

        {/* Footer Actions - Sticky */}
        {error && (
          <div className="bg-red-50 border-t border-red-200 text-red-700 px-8 py-4 text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDocumentModal;