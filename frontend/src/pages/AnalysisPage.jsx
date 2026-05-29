import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../services/projectService";
import { documentService } from "../services/documentService";
import { analysisService } from "../services/analysisService";
import AnalysisCard from "../components/analysis/AnalysisCard";
import StartAnalysisModal from "../components/analysis/StartAnalysisModal";
import {
  Plus,
  Search,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader,
} from "lucide-react";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, completed, running, failed

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadDocuments(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      const activeProjects = data.filter((p) => !p.is_archived);
      setProjects(activeProjects);
      if (activeProjects.length > 0) {
        setSelectedProject(activeProjects[0]);
      }
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách dự án");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (projectId) => {
    try {
      setLoading(true);
      const [docs, analyses] = await Promise.all([
        documentService.getProjectDocuments(projectId),
        analysisService.getProjectAnalyses(projectId),
      ]);
      setDocuments(docs);
      setAnalyses(analyses);
      setError("");
    } catch (err) {
      setError("Không thể tải dữ liệu phân tích");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async (documentId) => {
    try {
      const result = await analysisService.startAnalysis(
        selectedProject.id,
        documentId
      );
      setAnalyses([result, ...analyses]);
      setShowStartModal(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const stats = {
    total: analyses.length,
    completed: analyses.filter((a) => a.status === "completed").length,
    running: analyses.filter((a) => a.status === "running").length,
    failed: analyses.filter((a) => a.status === "failed").length,
  };

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.document_title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      analysis.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && analysis.status === filterStatus;
  });

  if (loading && selectedProject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải dữ liệu phân tích...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Phân tích tài liệu</h1>
            <p className="text-slate-600 mt-2">
              Quản lý và xem kết quả phân tích AI các tài liệu nghiên cứu
            </p>
          </div>
          <button
            onClick={() => setShowStartModal(true)}
            disabled={!selectedProject || documents.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Bắt đầu phân tích</span>
          </button>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Chọn dự án
            </label>
            <select
              value={selectedProject?.id || ""}
              onChange={(e) => {
                const project = projects.find((p) => p.id === e.target.value);
                setSelectedProject(project);
              }}
              className="w-full md:w-96 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Grid */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              label="Tổng cộng"
              value={stats.total}
              icon={BarChart3}
              color="teal"
            />
            <StatCard
              label="Hoàn thành"
              value={stats.completed}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              label="Đang chạy"
              value={stats.running}
              icon={Loader}
              color="blue"
            />
            <StatCard
              label="Thất bại"
              value={stats.failed}
              icon={AlertCircle}
              color="red"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* No Projects */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có dự án nào
            </h3>
            <p className="text-slate-600 mb-8">
              Tạo dự án và thêm tài liệu trước khi thực hiện phân tích
            </p>
            <a
              href="/projects"
              className="inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Quản lý dự án
            </a>
          </div>
        )}

        {/* Filters and Search */}
        {selectedProject && analyses.length > 0 && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phân tích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all text-slate-900 placeholder-slate-500"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <FilterButton
                active={filterStatus === "all"}
                onClick={() => setFilterStatus("all")}
                label="Tất cả"
                count={analyses.length}
              />
              <FilterButton
                active={filterStatus === "completed"}
                onClick={() => setFilterStatus("completed")}
                label="Hoàn thành"
                count={stats.completed}
              />
              <FilterButton
                active={filterStatus === "running"}
                onClick={() => setFilterStatus("running")}
                label="Đang chạy"
                count={stats.running}
              />
              <FilterButton
                active={filterStatus === "failed"}
                onClick={() => setFilterStatus("failed")}
                label="Thất bại"
                count={stats.failed}
              />
            </div>
          </div>
        )}

        {/* Analyses List */}
        {!loading && selectedProject && filteredAnalyses.length > 0 && (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                onClick={() => navigate(`/analysis/${analysis.id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedProject && analyses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có phân tích nào
            </h3>
            <p className="text-slate-600 mb-8">
              {documents.length === 0
                ? "Thêm tài liệu vào dự án trước khi phân tích"
                : "Bắt đầu phân tích tài liệu đầu tiên của bạn"}
            </p>
            {documents.length > 0 ? (
              <button
                onClick={() => setShowStartModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Bắt đầu phân tích
              </button>
            ) : (
              <a
                href="/documents"
                className="inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Quản lý tài liệu
              </a>
            )}
          </div>
        )}

        {/* No Results After Filter */}
        {!loading &&
          selectedProject &&
          analyses.length > 0 &&
          filteredAnalyses.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
      </div>

      {/* Modals */}
      {showStartModal && selectedProject && (
        <StartAnalysisModal
          documents={documents}
          onClose={() => setShowStartModal(false)}
          onStart={handleStartAnalysis}
        />
      )}
    </DashboardLayout>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    teal: "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    blue: "from-blue-50 to-blue-100",
    red: "from-red-50 to-red-100",
  };

  const iconColorClasses = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:shadow-md transition-all`}>
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, label, count }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
        active
          ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md hover:shadow-lg"
          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 font-bold ${active ? "text-teal-100" : "text-slate-600"}`}>
          ({count})
        </span>
      )}
    </button>
  );
};

export default AnalysisPage;