import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../services/projectService";
import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { Plus, Folder, CheckCircle2, Archive, AlertCircle } from "lucide-react";

const ProjectsPage = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, archived

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách dự án");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects([newProject, ...projects]);
      setShowCreateModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này?")) return;
    
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error(err);
      alert("Không thể xóa dự án");
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === "active") return !project.is_archived;
    if (filter === "archived") return project.is_archived;
    return true;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => !p.is_archived).length,
    archived: projects.filter(p => p.is_archived).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dự án</h1>
            <p className="text-slate-600 mt-2">
              Quản lý các dự án nghiên cứu học thuật của bạn
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo dự án mới</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Tổng số dự án"
            value={stats.total}
            icon={Folder}
            color="teal"
          />
          <StatCard
            title="Đang hoạt động"
            value={stats.active}
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Đã lưu trữ"
            value={stats.archived}
            icon={Archive}
            color="slate"
          />
        </div>

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
            active={filter === "active"}
            onClick={() => setFilter("active")}
            label="Đang hoạt động"
          />
          <FilterButton
            active={filter === "archived"}
            onClick={() => setFilter("archived")}
            label="Đã lưu trữ"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải dự án...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === "all" ? "Chưa có dự án nào" : `Không có dự án ${filter === "active" ? "đang hoạt động" : "đã lưu trữ"}`}
            </h3>
            <p className="text-slate-600 mb-8">
              {filter === "all" ? "Tạo dự án đầu tiên để bắt đầu nghiên cứu" : "Thử thay đổi bộ lọc"}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Tạo dự án đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    teal: "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    slate: "from-slate-50 to-slate-100",
  };

  const iconColorClasses = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
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

export default ProjectsPage;