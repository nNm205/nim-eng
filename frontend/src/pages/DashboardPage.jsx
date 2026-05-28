import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  BookOpen,
  FileText,
  BarChart3,
  ClipboardList,
  Plus,
  Upload,
  Search,
  TrendingUp,
  Folder,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats] = useState({
    projects: 0,
    documents: 0,
    analyses: 0,
    reports: 0
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
          <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-teal-500 opacity-10 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3">
              Chào mừng, {user?.full_name || "User"}
            </h1>
            <p className="text-slate-300 text-lg">
              Tiếp tục các dự án nghiên cứu và phân tích của bạn
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Dự án"
            value={stats.projects}
            icon={Folder}
            trend="0"
            period="tuần này"
          />
          <StatCard
            title="Tài liệu"
            value={stats.documents}
            icon={FileText}
            trend="0"
            period="tuần này"
          />
          <StatCard
            title="Phân tích"
            value={stats.analyses}
            icon={BarChart3}
            trend="0"
            period="tuần này"
          />
          <StatCard
            title="Báo cáo"
            value={stats.reports}
            icon={ClipboardList}
            trend="0"
            period="tuần này"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Thao tác nhanh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard
                  icon={Plus}
                  title="Dự án mới"
                  description="Bắt đầu một dự án nghiên cứu"
                  onClick={() => alert("Chức năng đang phát triển")}
                />
                <QuickActionCard
                  icon={Upload}
                  title="Upload tài liệu"
                  description="Thêm tài liệu vào knowledge base"
                  onClick={() => alert("Chức năng đang phát triển")}
                />
                <QuickActionCard
                  icon={Search}
                  title="Phân tích dữ liệu"
                  description="Chạy phân tích với AI agents"
                  onClick={() => alert("Chức năng đang phát triển")}
                />
              </div>
            </div>

            {/* Projects Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Dự án của bạn
                </h2>
                <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-2 group">
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, idx) => (
                  <ProjectCard key={idx} {...project} />
                ))}
              </div>
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Chưa có dự án nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow h-fit sticky top-20">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Hoạt động gần đây
              </h2>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <ActivityItem key={idx} {...activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">Chưa có hoạt động</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, period }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-200 transition-all">
          <Icon className="w-7 h-7 text-teal-600" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-teal-600">+{trend}</span> {period}
        </p>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left p-6 border-2 border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
        <Icon className="w-6 h-6 text-slate-600 group-hover:text-teal-600 transition-colors" />
      </div>
      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{description}</p>
    </button>
  );
};

const ActivityItem = ({ type, title, time, status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle2,
      label: "Hoàn thành"
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: AlertCircle,
      label: "Đang xử lý"
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: Clock,
      label: "Chờ xử lý"
    }
  };

  const typeIcons = {
    analysis: BarChart3,
    document: FileText,
    report: ClipboardList,
    project: Folder
  };

  const config = statusConfig[status];
  const TypeIcon = typeIcons[type];
  const StatusIcon = config.icon;

  return (
    <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            {TypeIcon && <TypeIcon className="w-4 h-4 text-slate-600" />}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {title}
          </p>
          <p className="text-xs text-slate-500 mt-1">{time}</p>
        </div>
        <div className={`flex-shrink-0 px-2 py-1 rounded-lg ${config.bg} flex items-center gap-1`}>
          <StatusIcon className={`w-3 h-3 ${config.text}`} />
          <span className={`text-xs font-medium ${config.text} hidden sm:inline`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ name, description, progress, lastUpdated }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all group cursor-pointer">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">Tiến độ</span>
          <span className="font-bold text-slate-900">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">Cập nhật: {lastUpdated}</p>
          {progress >= 75 && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              Sắp xong
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const recentActivities = [
  {
    type: "analysis",
    title: "Phân tích dữ liệu khảo sát hoàn thành",
    time: "2 giờ trước",
    status: "completed"
  },
  {
    type: "document",
    title: "Đã upload 5 tài liệu mới",
    time: "5 giờ trước",
    status: "completed"
  },
  {
    type: "report",
    title: "Báo cáo tháng 1 đang được tạo",
    time: "1 ngày trước",
    status: "processing"
  },
  {
    type: "project",
    title: "Dự án nghiên cứu thị trường được tạo",
    time: "2 ngày trước",
    status: "completed"
  }
];

const projects = [
  {
    name: "Nghiên cứu thị trường 2024",
    description: "Phân tích xu hướng thị trường công nghệ",
    progress: 75,
    lastUpdated: "Hôm nay"
  },
  {
    name: "Khảo sát khách hàng Q1",
    description: "Thu thập và phân tích feedback khách hàng",
    progress: 45,
    lastUpdated: "Hôm qua"
  }
];

export default DashboardPage;