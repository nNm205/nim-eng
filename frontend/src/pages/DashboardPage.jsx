import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats] = useState({
    projects: 12,
    documents: 48,
    analyses: 23,
    reports: 15
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Xin chào, {user?.full_name || "User"}! 👋
          </h1>
          <p className="text-blue-100">
            Chào mừng bạn quay trở lại. Đây là tổng quan về hoạt động của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Dự án"
            value={stats.projects}
            icon="📁"
            color="blue"
            trend="+2 tuần này"
          />
          <StatCard
            title="Tài liệu"
            value={stats.documents}
            icon="📄"
            color="green"
            trend="+8 tuần này"
          />
          <StatCard
            title="Phân tích"
            value={stats.analyses}
            icon="📊"
            color="purple"
            trend="+5 tuần này"
          />
          <StatCard
            title="Báo cáo"
            value={stats.reports}
            icon="📝"
            color="orange"
            trend="+3 tuần này"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon="➕"
              title="Tạo dự án mới"
              description="Bắt đầu một dự án nghiên cứu mới"
              onClick={() => alert("Chức năng đang phát triển")}
            />
            <QuickActionCard
              icon="📤"
              title="Upload tài liệu"
              description="Thêm tài liệu vào knowledge base"
              onClick={() => alert("Chức năng đang phát triển")}
            />
            <QuickActionCard
              icon="🔍"
              title="Bắt đầu phân tích"
              description="Chạy phân tích với AI agents"
              onClick={() => alert("Chức năng đang phát triển")}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hoạt động gần đây
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Dự án của bạn
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem tất cả →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} {...project} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{trend}</p>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

const ActivityItem = ({ type, title, time, status }) => {
  const statusColors = {
    completed: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700"
  };

  const typeIcons = {
    analysis: "📊",
    document: "📄",
    report: "📝",
    project: "📁"
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{typeIcons[type]}</div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status === "completed" && "Hoàn thành"}
        {status === "processing" && "Đang xử lý"}
        {status === "pending" && "Chờ xử lý"}
      </span>
    </div>
  );
};

const ProjectCard = ({ name, description, progress, lastUpdated }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tiến độ</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">Cập nhật: {lastUpdated}</p>
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
