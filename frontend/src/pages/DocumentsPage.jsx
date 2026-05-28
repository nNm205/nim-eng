import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Clock, AlertCircle, Plus, Folder } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { projectService } from "../services/projectService";
import { documentService } from "../services/documentService";
import DocumentCard from "../components/documents/DocumentCard";
import CreateDocumentModal from "../components/documents/CreateDocumentModal";

const DocumentsPage = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      const activeProjects = data.filter(p => !p.is_archived);
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
      const data = await documentService.getProjectDocuments(projectId);
      setDocuments(data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách tài liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (documentData) => {
    try {
      const newDoc = await documentService.createDocument(
        selectedProject.id,
        documentData
      );
      setDocuments([newDoc, ...documents]);
      setShowCreateModal(false);
    } catch (err) {
      throw err;
    }
  };

  const stats = {
    total: documents.length,
    processed: documents.filter(d => d.processed).length,
    unprocessed: documents.filter(d => !d.processed).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tài liệu</h1>
            <p className="text-slate-600 mt-2">
              Quản lý tài liệu nghiên cứu của bạn
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedProject}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm tài liệu</span>
          </button>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Chọn dự án
            </label>
            <select
              value={selectedProject?.id || ""}
              onChange={(e) => {
                const project = projects.find(p => p.id === e.target.value);
                setSelectedProject(project);
              }}
              className="w-full md:w-96 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all bg-white text-slate-900 font-medium"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Tổng tài liệu"
              value={stats.total}
              icon={FileText}
              color="teal"
            />
            <StatCard
              label="Đã xử lý"
              value={stats.processed}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              label="Chưa xử lý"
              value={stats.unprocessed}
              icon={Clock}
              color="amber"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* No Projects */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có dự án nào
            </h3>
            <p className="text-slate-600 mb-8">
              Tạo dự án trước để thêm tài liệu
            </p>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo dự án</span>
            </a>
          </div>
        )}

        {/* Loading */}
        {loading && selectedProject && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Đang tải tài liệu...</p>
          </div>
        )}

        {/* Documents Grid */}
        {!loading && selectedProject && documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => navigate(`/projects/${selectedProject.id}/documents/${document.id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedProject && documents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có tài liệu nào
            </h3>
            <p className="text-slate-600 mb-8">
              Thêm tài liệu đầu tiên cho dự án này
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm tài liệu đầu tiên</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && selectedProject && (
        <CreateDocumentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDocument}
        />
      )}
    </DashboardLayout>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    teal: "from-teal-50 to-teal-100",
    emerald: "from-emerald-50 to-emerald-100",
    amber: "from-amber-50 to-amber-100",
  };

  const iconColorClasses = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
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

export default DocumentsPage;