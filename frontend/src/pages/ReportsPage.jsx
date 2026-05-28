import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../services/projectService";
import { reportService } from "../services/reportService";
import ReportCard from "../components/reports/ReportCard";
import CreateReportModal from "../components/reports/CreateReportModal";
import { Plus, FileText, CheckCircle2, Archive, AlertCircle } from "lucide-react";

const ReportsPage = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadReports(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      const activeProjects = data.filter(p => !p.is_archived);
      setProjects(activeProjects);
      if (activeProjects.length > 0) {
        setSelectedProject(activeProjects[0]);
      }
    } catch (err) {
      setError("Không thể tải danh sách dự án");
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async (projectId) => {
    try {
      setLoading(true);
      const data = await reportService.getProjectReports(projectId);
      setReports(data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (reportData) => {
    try {
      const newReport = await reportService.createReport(selectedProject.id, reportData);
      setReports([newReport, ...reports]);
      setShowCreateModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateReport = async (reportId, updateData) => {
    try {
      const updated = await reportService.updateReport(reportId, updateData);
      setReports(reports.map(r => r.id === reportId ? updated : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này?")) return;
    try {
      await reportService.deleteReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === "all") return true;
    return report.status === filter;
  });

  const stats = {
    total: reports.length,
    draft: reports.filter(r => r.status === "draft").length,
    published: reports.filter(r => r.status === "published").length,
    archived: reports.filter(r => r.status === "archived").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Báo cáo</h1>
            <p className="text-slate-600 mt-2">
              Tạo và quản lý báo cáo nghiên cứu học thuật
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedProject}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo báo cáo</span>
          </button>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Chọn dự án</label>
            <select
              value={selectedProject?.id || ""}
              onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value))}
              className="w-full md:w-96 border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-slate-900 font-medium"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Grid */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Tổng số"
              value={stats.total}
              icon={FileText}
              color="teal"
            />
            <StatCard
              title="Nháp"
              value={stats.draft}
              icon={FileText}
              color="amber"
            />
            <StatCard
              title="Đã xuất bản"
              value={stats.published}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Lưu trữ"
              value={stats.archived}
              icon={Archive}
              color="slate"
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

        {/* Filters */}
        <div className="flex items-center gap-3">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Tất cả"
          />
          <FilterButton
            active={filter === "draft"}
            onClick={() => setFilter("draft")}
            label="Nháp"
          />
          <FilterButton
            active={filter === "published"}
            onClick={() => setFilter("published")}
            label="Đã xuất bản"
          />
          <FilterButton
            active={filter === "archived"}
            onClick={() => setFilter("archived")}
            label="Lưu trữ"
          />
        </div>

        {/* No Projects State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có dự án nào
            </h3>
            <p className="text-slate-600 mb-8">
              Tạo dự án trước để tạo báo cáo
            </p>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Tạo dự án
            </a>
          </div>
        )}

        {/* Loading State */}
        {loading && selectedProject && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải báo cáo...</p>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && selectedProject && filteredReports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => navigate(`/reports/${report.id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedProject && filteredReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === "all" ? "Chưa có báo cáo nào" : `Không có báo cáo ${filter === "draft" ? "nháp" : filter === "published" ? "đã xuất bản" : "đã lưu trữ"}`}
            </h3>
            <p className="text-slate-600 mb-8">
              {filter === "all" ? "Tạo báo cáo đầu tiên cho dự án này" : "Thử thay đổi bộ lọc"}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Tạo báo cáo đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && selectedProject && (
        <CreateReportModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateReport}
        />
      )}
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    teal: "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    amber: "from-amber-50 to-amber-100",
    slate: "from-slate-50 to-slate-100",
  };

  const iconColorClasses = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    slate: "text-slate-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:shadow-md transition-all`}>
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md hover:shadow-lg"
          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
};

export default ReportsPage;
