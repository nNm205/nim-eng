import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader,
  Clock,
  Download,
  Share2,
} from "lucide-react";

const AnalysisResultsPage = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    findings: true,
    keywords: true,
    entities: false,
    sentiment: false,
  });

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      // Mock data - replace với API call thực tế
      const mockAnalysis = {
        id: analysisId,
        document_id: "doc-123",
        document_title: "Nghiên cứu về AI trong Giáo dục 2024",
        status: "completed",
        started_at: new Date(Date.now() - 300000).toISOString(),
        completed_at: new Date().toISOString(),
        processed_by: "Claude 3 Sonnet",
        summary:
          "Tài liệu này phân tích sâu về tác động của AI và machine learning trong ngành giáo dục. Nghiên cứu tập trung vào các ứng dụng hiện tại, thách thức, và những cơ hội tiềm năng. Kết luận cho thấy rằng AI sẽ đóng vai trò quan trọng trong việc cá nhân hóa học tập, tự động hóa quản lý và cải thiện kết quả học tập.",
        key_findings: [
          "Personalization: AI cho phép tạo ra các lộ trình học tập được tùy chỉnh cho từng học sinh",
          "Efficiency: Giáo viên có thể tiết kiệm 5-10 giờ mỗi tuần nhờ tự động hóa việc chấm điểm",
          "Accessibility: Công nghệ AI tạo điều kiện thuận lợi cho học sinh khuyết tật",
          "Challenges: Cần quy định rõ ràng về bảo mật dữ liệu và quyền sử dụng",
          "Training: Giáo viên cần được đào tạo để sử dụng hiệu quả các công cụ AI",
        ],
        keywords: [
          "Artificial Intelligence",
          "Machine Learning",
          "Education",
          "Personalization",
          "Automation",
          "Learning Analytics",
          "Adaptive Learning",
          "EdTech",
          "Student Outcomes",
          "Digital Transformation",
        ],
        extracted_entities: {
          organizations: ["UNESCO", "MIT Media Lab", "Stanford University"],
          people: ["Andrew Ng", "Geoffrey Hinton"],
          locations: ["Singapore", "Vietnam", "United States"],
          technologies: ["GPT-4", "BERT", "TensorFlow"],
        },
        sentiment: "positive",
      };
      setAnalysis(mockAnalysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const getDuration = () => {
    if (!analysis?.started_at || !analysis?.completed_at) return null;
    const start = new Date(analysis.started_at);
    const end = new Date(analysis.completed_at);
    const seconds = Math.floor((end - start) / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      color: "slate",
      icon: Clock,
    },
    running: {
      label: "Đang chạy",
      color: "blue",
      icon: Loader,
    },
    completed: {
      label: "Hoàn thành",
      color: "emerald",
      icon: CheckCircle2,
    },
    failed: {
      label: "Thất bại",
      color: "red",
      icon: AlertCircle,
    },
  };

  const sentimentConfig = {
    positive: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Tích cực",
    },
    neutral: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      label: "Trung lập",
    },
    negative: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Tiêu cực",
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">
              Đang tải kết quả phân tích...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Không tìm thấy phân tích
          </h2>
          <p className="text-slate-600 mb-8">
            Phân tích bạn tìm không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={() => navigate("/analysis")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại phân tích
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = statusConfig[analysis.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const sentiment = sentimentConfig[analysis.sentiment] || sentimentConfig.neutral;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => navigate("/analysis")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Phân tích
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">
            {analysis.document_title}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-teal-50">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {analysis.document_title}
                </h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <span className="text-teal-600 font-semibold">
                    {analysis.id}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              title="Chia sẻ"
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              title="Tải xuống"
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                    <StatusIcon className="w-7 h-7 text-teal-600" />
                    Kết quả phân tích
                  </h2>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-700`}
                >
                  {statusInfo.label}
                </span>
              </div>

              {analysis.status === "running" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">
                    Đang phân tích tài liệu...
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Quá trình này có thể mất vài phút
                  </p>
                </div>
              )}

              {analysis.status === "failed" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Phân tích thất bại
                  </h3>
                  {analysis.error_message && (
                    <p className="text-red-700">{analysis.error_message}</p>
                  )}
                </div>
              )}

              {analysis.status === "completed" && (
                <div className="space-y-6">
                  {/* Summary */}
                  {analysis.summary && (
                    <SectionCard
                      title="📝 Tóm tắt"
                      isExpanded={expandedSections.summary}
                      onToggle={() => toggleSection("summary")}
                    >
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {analysis.summary}
                      </p>
                    </SectionCard>
                  )}

                  {/* Key Findings */}
                  {analysis.key_findings &&
                    analysis.key_findings.length > 0 && (
                      <SectionCard
                        title="🔍 Phát hiện quan trọng"
                        isExpanded={expandedSections.findings}
                        onToggle={() => toggleSection("findings")}
                        count={analysis.key_findings.length}
                      >
                        <ul className="space-y-3">
                          {analysis.key_findings.map((finding, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-100"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-slate-700">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </SectionCard>
                    )}

                  {/* Keywords */}
                  {analysis.keywords && analysis.keywords.length > 0 && (
                    <SectionCard
                      title="🏷️ Từ khóa chính"
                      isExpanded={expandedSections.keywords}
                      onToggle={() => toggleSection("keywords")}
                      count={analysis.keywords.length}
                    >
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {/* Sentiment */}
                  {analysis.sentiment && (
                    <SectionCard
                      title="😊 Phân tích cảm xúc"
                      isExpanded={expandedSections.sentiment}
                      onToggle={() => toggleSection("sentiment")}
                    >
                      <div
                        className={`p-6 rounded-lg border ${sentiment.bg} ${sentiment.border}`}
                      >
                        <p
                          className={`text-lg font-bold ${sentiment.text} capitalize`}
                        >
                          {sentiment.label}
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                          Tài liệu có xu hướng{" "}
                          <span className="font-semibold">{sentiment.label.toLowerCase()}</span>
                        </p>
                      </div>
                    </SectionCard>
                  )}

                  {/* Entities */}
                  {analysis.extracted_entities &&
                    Object.keys(analysis.extracted_entities).length > 0 && (
                      <SectionCard
                        title="🎯 Thực thể trích xuất"
                        isExpanded={expandedSections.entities}
                        onToggle={() => toggleSection("entities")}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(
                            analysis.extracted_entities
                          ).map(([type, entities]) => (
                            <div
                              key={type}
                              className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                            >
                              <p className="font-semibold text-slate-900 mb-3 capitalize">
                                {type}
                              </p>
                              <div className="space-y-2">
                                {Array.isArray(entities) ? (
                                  entities.map((entity, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm text-slate-700 flex items-center gap-2"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                                      {entity}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-slate-700">
                                    {entities}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                Thông tin phân tích
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">
                    Trạng thái
                  </p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                    {statusInfo.label}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Bắt đầu
                  </p>
                  <p className="text-sm text-slate-700 font-medium">
                    {formatDate(analysis.started_at)}
                  </p>
                </div>

                {analysis.completed_at && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Hoàn thành
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {formatDate(analysis.completed_at)}
                    </p>
                  </div>
                )}

                {getDuration() && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Thời gian xử lý
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {getDuration()}
                    </p>
                  </div>
                )}

                {analysis.processed_by && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">
                      Xử lý bởi
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {analysis.processed_by}
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1">
                    Analysis ID
                  </p>
                  <p className="text-xs font-mono text-slate-600 break-all bg-slate-50 p-2 rounded">
                    {analysis.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            {analysis.status === "completed" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                  Thống kê
                </h3>
                <div className="space-y-3">
                  <StatLine
                    label="Phát hiện quan trọng"
                    value={analysis.key_findings?.length || 0}
                  />
                  <StatLine
                    label="Từ khóa"
                    value={analysis.keywords?.length || 0}
                  />
                  <StatLine
                    label="Thực thể"
                    value={
                      Object.values(analysis.extracted_entities || {}).reduce(
                        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 1),
                        0
                      ) || 0
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const SectionCard = ({ title, children, isExpanded, onToggle, count }) => {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors bg-white"
      >
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          {title}
          {count && (
            <span className="text-sm font-semibold text-slate-500 ml-1">
              ({count})
            </span>
          )}
        </h3>
        <svg
          className={`w-5 h-5 text-slate-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          {children}
        </div>
      )}
    </div>
  );
};

const StatLine = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-lg font-bold text-teal-600">{value}</p>
    </div>
  );
};

export default AnalysisResultsPage;