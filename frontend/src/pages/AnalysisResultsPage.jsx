import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { analysisService } from "../services/analysisService";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader,
  Clock,
  FileText,
  Tag,
  Lightbulb,
  Users,
  SmilePlus,
  ChevronDown,
  Hash,
} from "lucide-react";

const AnalysisResultsPage = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      const data = await analysisService.getAnalysis(analysisId);
      setAnalysis(data);
      setError("");
    } catch (err) {
      setError("Không thể tải kết quả phân tích");
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
    const seconds = Math.floor(
      (new Date(analysis.completed_at) - new Date(analysis.started_at)) / 1000
    );
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const statusConfig = {
    pending:   { label: "Chờ xử lý", icon: Clock,        bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200",   badge: "bg-slate-100 text-slate-700"   },
    running:   { label: "Đang chạy", icon: Loader,       bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    badge: "bg-blue-100 text-blue-700"    },
    completed: { label: "Hoàn thành",icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700"},
    failed:    { label: "Thất bại",  icon: AlertCircle,  bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     badge: "bg-red-100 text-red-700"     },
  };

  const sentimentConfig = {
    positive: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Tích cực" },
    neutral:  { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200",   label: "Trung lập" },
    negative: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     label: "Tiêu cực" },
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải kết quả phân tích...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────
  if (error || !analysis) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy phân tích</h2>
          <p className="text-slate-600 mb-8">{error || "Phân tích không tồn tại hoặc đã bị xóa"}</p>
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
  const totalEntities = Object.values(analysis.extracted_entities || {})
    .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 1), 0);

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
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {analysis.document_title}
          </span>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-5">
            <div className={`p-4 rounded-2xl ${statusInfo.bg} border ${statusInfo.border} flex-shrink-0`}>
              <StatusIcon className={`w-8 h-8 ${statusInfo.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    {analysis.document_title || `Phân tích ${analysis.id?.slice(0, 8)}`}
                  </h1>
                  <p className="text-sm text-slate-500 font-mono">ID: {analysis.id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-sm font-bold ${statusInfo.badge}`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Quick stats row */}
              {analysis.status === "completed" && (
                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-slate-100 flex-wrap">
                  <QuickStat icon={Lightbulb} label="Phát hiện" value={analysis.key_findings?.length || 0} color="text-amber-600" />
                  <QuickStat icon={Tag}       label="Từ khóa"   value={analysis.keywords?.length || 0}      color="text-violet-600" />
                  <QuickStat icon={Users}     label="Thực thể"  value={totalEntities}                        color="text-blue-600"   />
                  {getDuration() && (
                    <QuickStat icon={Clock} label="Thời gian" value={getDuration()} color="text-slate-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main body: 2-col layout mirroring ProjectDetailPage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — analysis content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Running state */}
            {analysis.status === "running" && (
              <div className="bg-white rounded-2xl border border-blue-200 p-10 shadow-sm text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Đang phân tích tài liệu...</h3>
                <p className="text-slate-500 text-sm">Quá trình này có thể mất vài phút</p>
                <div className="mt-6 w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full animate-pulse w-2/3"></div>
                </div>
              </div>
            )}

            {/* Pending state */}
            {analysis.status === "pending" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm text-center">
                <Clock className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Đang chờ xử lý</h3>
                <p className="text-slate-500 text-sm">Phân tích sẽ bắt đầu sớm</p>
              </div>
            )}

            {/* Failed state */}
            {analysis.status === "failed" && (
              <div className="bg-white rounded-2xl border border-red-200 p-10 shadow-sm text-center">
                <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Phân tích thất bại</h3>
                {analysis.error_message && (
                  <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 mt-3 text-left">
                    {analysis.error_message}
                  </p>
                )}
              </div>
            )}

            {/* Completed — result sections */}
            {analysis.status === "completed" && (
              <>
                {/* Summary */}
                {analysis.summary && (
                  <SectionCard
                    icon={FileText}
                    title="Tóm tắt"
                    isExpanded={expandedSections.summary}
                    onToggle={() => toggleSection("summary")}
                  >
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {analysis.summary}
                    </p>
                  </SectionCard>
                )}

                {/* Key findings */}
                {analysis.key_findings?.length > 0 && (
                  <SectionCard
                    icon={Lightbulb}
                    title="Phát hiện quan trọng"
                    count={analysis.key_findings.length}
                    isExpanded={expandedSections.findings}
                    onToggle={() => toggleSection("findings")}
                  >
                    <ol className="space-y-3">
                      {analysis.key_findings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-700 text-sm leading-relaxed">{finding}</p>
                        </li>
                      ))}
                    </ol>
                  </SectionCard>
                )}

                {/* Keywords */}
                {analysis.keywords?.length > 0 && (
                  <SectionCard
                    icon={Hash}
                    title="Từ khóa"
                    count={analysis.keywords.length}
                    isExpanded={expandedSections.keywords}
                    onToggle={() => toggleSection("keywords")}
                  >
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Sentiment */}
                {analysis.sentiment && (
                  <SectionCard
                    icon={SmilePlus}
                    title="Cảm xúc tài liệu"
                    isExpanded={expandedSections.sentiment}
                    onToggle={() => toggleSection("sentiment")}
                  >
                    <div className={`flex items-center gap-4 p-5 rounded-xl border ${sentiment.bg} ${sentiment.border}`}>
                      <div className={`w-12 h-12 rounded-xl ${sentiment.bg} border ${sentiment.border} flex items-center justify-center`}>
                        <SmilePlus className={`w-6 h-6 ${sentiment.text}`} />
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${sentiment.text}`}>{sentiment.label}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Xu hướng cảm xúc chủ đạo trong tài liệu
                        </p>
                      </div>
                    </div>
                  </SectionCard>
                )}

                {/* Extracted entities */}
                {analysis.extracted_entities &&
                  Object.keys(analysis.extracted_entities).length > 0 && (
                    <SectionCard
                      icon={Users}
                      title="Thực thể trích xuất"
                      count={totalEntities}
                      isExpanded={expandedSections.entities}
                      onToggle={() => toggleSection("entities")}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(analysis.extracted_entities).map(([type, entities]) => (
                          <div key={type} className="bg-white rounded-xl border border-slate-200 p-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 capitalize">
                              {type}
                            </p>
                            <div className="space-y-2">
                              {Array.isArray(entities) ? (
                                entities.map((entity, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                                    {entity}
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-700">{entities}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}
              </>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="space-y-6">

            {/* Metadata card — mirrors ProjectDetailPage sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wide">
                Thông tin phân tích
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Trạng thái</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${statusInfo.badge}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Bắt đầu
                  </p>
                  <p className="text-sm text-slate-700 font-medium">{formatDate(analysis.started_at)}</p>
                </div>

                {analysis.completed_at && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Hoàn thành
                    </p>
                    <p className="text-sm text-slate-700 font-medium">{formatDate(analysis.completed_at)}</p>
                  </div>
                )}

                {getDuration() && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Thời gian xử lý</p>
                    <p className="text-sm text-slate-700 font-medium">{getDuration()}</p>
                  </div>
                )}

                {analysis.processed_by && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Xử lý bởi</p>
                    <p className="text-sm text-slate-700 font-medium">{analysis.processed_by}</p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Analysis ID</p>
                  <p className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 break-all">
                    {analysis.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats card */}
            {analysis.status === "completed" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600 mb-6 uppercase tracking-wide">
                  Thống kê
                </h3>
                <div className="space-y-4">
                  <StatLine
                    icon={Lightbulb}
                    label="Phát hiện quan trọng"
                    value={analysis.key_findings?.length || 0}
                    color="text-amber-600"
                    bg="bg-amber-50"
                  />
                  <StatLine
                    icon={Tag}
                    label="Từ khóa"
                    value={analysis.keywords?.length || 0}
                    color="text-violet-600"
                    bg="bg-violet-50"
                  />
                  <StatLine
                    icon={Users}
                    label="Thực thể"
                    value={totalEntities}
                    color="text-blue-600"
                    bg="bg-blue-50"
                  />
                </div>
              </div>
            )}

            {/* Back button */}
            <button
              onClick={() => navigate("/analysis")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ icon: Icon, title, children, isExpanded, onToggle, count }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
    >
      <h3 className="font-bold text-slate-900 flex items-center gap-3">
        <Icon className="w-5 h-5 text-teal-600" />
        {title}
        {count !== undefined && (
          <span className="text-sm font-semibold text-slate-400">({count})</span>
        )}
      </h3>
      <ChevronDown
        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
      />
    </button>
    {isExpanded && (
      <div className="px-6 py-5 border-t border-slate-100">
        {children}
      </div>
    )}
  </div>
);

const QuickStat = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2">
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-sm text-slate-500">{label}:</span>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);

const StatLine = ({ icon: Icon, label, value, color, bg }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

export default AnalysisResultsPage;