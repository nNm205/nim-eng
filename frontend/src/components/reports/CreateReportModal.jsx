import { useState } from "react";
import { X } from "lucide-react";

const CreateReportModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    report_type: "research_summary",
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
      setError(err.response?.data?.detail || "Không thể tạo báo cáo");
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

  const reportTypes = [
    { 
      value: "research_summary", 
      label: "Tóm tắt nghiên cứu",
      description: "Tóm tắt các kết quả nghiên cứu chính"
    },
    { 
      value: "literature_review", 
      label: "Tổng quan tài liệu",
      description: "Đánh giá và phân tích các tài liệu tham khảo"
    },
    { 
      value: "data_analysis", 
      label: "Phân tích dữ liệu",
      description: "Phân tích và diễn giải dữ liệu nghiên cứu"
    },
    { 
      value: "custom", 
      label: "Tùy chỉnh",
      description: "Tạo báo cáo với cấu trúc tùy chỉnh"
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tạo báo cáo mới</h2>
            <p className="text-sm text-slate-600 mt-1">
              Khởi tạo một báo cáo nghiên cứu mới cho dự án
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
              placeholder="Ví dụ: Báo cáo phân tích thị trường AI 2024"
            />
            <p className="text-xs text-slate-500 mt-2">
              Tối thiểu 3 ký tự, tối đa 255 ký tự
            </p>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Loại báo cáo <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-start p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-all"
                >
                  <input
                    type="radio"
                    name="report_type"
                    value={type.value}
                    checked={formData.report_type === type.value}
                    onChange={handleChange}
                    className="w-5 h-5 text-teal-600 mt-0.5"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-slate-900">{type.label}</p>
                    <p className="text-sm text-slate-600">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nội dung <span className="text-slate-400">(Tùy chọn)</span>
            </label>
            <textarea
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all resize-none text-slate-900"
              placeholder="Nhập nội dung sơ bộ của báo cáo (có thể sửa đổi sau)..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Bạn có thể bổ sung nội dung sau khi tạo báo cáo
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
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
              {loading ? "Đang tạo..." : "Tạo báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;