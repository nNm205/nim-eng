import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Settings,
  Bell,
  Lock,
  Key,
  Globe,
  Clock,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Check,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",

    // Notifications
    emailNotifications: true,
    analysisComplete: true,
    reportGenerated: true,
    weeklyDigest: false,

    // Privacy
    profileVisibility: "private",
    dataSharing: false,

    // API
    apiKey: "sk_test_*********************",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = () => {
    setMessage({
      type: "success",
      text: "Cài đặt đã được lưu thành công!",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const tabs = [
    { id: "general", label: "Chung", icon: Settings },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "privacy", label: "Bảo mật", icon: Lock },
    { id: "api", label: "API", icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cài đặt</h1>
          <p className="text-slate-600 mt-2">
            Quản lý cài đặt hệ thống và tùy chọn của bạn
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`border rounded-xl px-4 py-4 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                      activeTab === tab.id
                        ? "bg-teal-50 text-teal-600 border border-teal-200"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              {activeTab === "general" && (
                <GeneralSettings
                  settings={settings}
                  setSettings={setSettings}
                  onSave={handleSave}
                />
              )}
              {activeTab === "notifications" && (
                <NotificationSettings
                  settings={settings}
                  setSettings={setSettings}
                  onSave={handleSave}
                />
              )}
              {activeTab === "privacy" && (
                <PrivacySettings
                  settings={settings}
                  setSettings={setSettings}
                  onSave={handleSave}
                />
              )}
              {activeTab === "api" && (
                <APISettings
                  settings={settings}
                  setSettings={setSettings}
                  onSave={handleSave}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const GeneralSettings = ({ settings, setSettings, onSave }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Cài đặt chung
        </h2>
        <p className="text-slate-600">
          Cấu hình các tùy chọn chung của hệ thống
        </p>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <Globe className="w-4 h-4 text-teal-600" />
            Ngôn ngữ
          </label>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <Clock className="w-4 h-4 text-teal-600" />
            Múi giờ
          </label>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
          >
            <option value="Asia/Ho_Chi_Minh">
              Hồ Chí Minh (GMT+7)
            </option>
            <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
            <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
            <option value="America/New_York">New York (GMT-5)</option>
            <option value="Europe/London">London (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <Calendar className="w-4 h-4 text-teal-600" />
            Định dạng ngày
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) =>
              setSettings({ ...settings, dateFormat: e.target.value })
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

const NotificationSettings = ({ settings, setSettings, onSave }) => {
  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Cài đặt thông báo
        </h2>
        <p className="text-slate-600">
          Quản lý cách bạn nhận được thông báo
        </p>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-8">
        <ToggleItem
          label="Thông báo qua email"
          description="Nhận thông báo quan trọng qua email"
          checked={settings.emailNotifications}
          onChange={() => toggleSetting("emailNotifications")}
        />

        <ToggleItem
          label="Phân tích hoàn thành"
          description="Thông báo khi phân tích tài liệu hoàn thành"
          checked={settings.analysisComplete}
          onChange={() => toggleSetting("analysisComplete")}
        />

        <ToggleItem
          label="Báo cáo được tạo"
          description="Thông báo khi báo cáo mới được tạo"
          checked={settings.reportGenerated}
          onChange={() => toggleSetting("reportGenerated")}
        />

        <ToggleItem
          label="Tóm tắt hàng tuần"
          description="Nhận email tóm tắt hoạt động hàng tuần vào thứ Hai"
          checked={settings.weeklyDigest}
          onChange={() => toggleSetting("weeklyDigest")}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

const PrivacySettings = ({ settings, setSettings, onSave }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Bảo mật & Quyền riêng tư
        </h2>
        <p className="text-slate-600">
          Kiểm soát quyền riêng tư và bảo mật dữ liệu của bạn
        </p>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Hiển thị hồ sơ
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) =>
              setSettings({
                ...settings,
                profileVisibility: e.target.value,
              })
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all"
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
            <option value="team">Chỉ team</option>
          </select>
          <p className="text-xs text-slate-500 mt-2">
            Chọn ai có thể xem hồ sơ của bạn
          </p>
        </div>

        <ToggleItem
          label="Chia sẻ dữ liệu"
          description="Cho phép chia sẻ dữ liệu ẩn danh để cải thiện dịch vụ"
          checked={settings.dataSharing}
          onChange={() =>
            setSettings({
              ...settings,
              dataSharing: !settings.dataSharing,
            })
          }
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Lưu ý về quyền riêng tư</p>
          <p className="text-amber-800">
            Dữ liệu của bạn được mã hóa và bảo mật. Chúng tôi không bao giờ
            chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý
            của bạn.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

const APISettings = ({ settings, onSave }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">API Keys</h2>
        <p className="text-slate-600">
          Quản lý API keys để tích hợp với ứng dụng khác
        </p>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            API Key
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                readOnly
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-mono text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-3 border rounded-xl font-semibold transition-all flex items-center gap-2 ${
                copied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã copy
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
            Tạo key mới
          </button>
          <button className="px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all">
            Xóa key
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Hướng dẫn sử dụng API</p>
          <p className="text-blue-800 mb-2">
            Xem tài liệu API tại:{" "}
            <a
              href="#"
              className="underline font-semibold hover:text-blue-700"
            >
              docs.nim-research.com/api
            </a>
          </p>
          <p className="text-blue-800 text-xs">
            Giữ API key của bạn bí mật. Không chia sẻ nó công khai hoặc
            trong code được commit.
          </p>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-4 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="flex-1">
        <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
          {label}
        </p>
        <p className="text-sm text-slate-600 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0 ${
          checked ? "bg-teal-600 shadow-lg" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

// Simple Calendar icon component since it might not be in lucide-react
const Calendar = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default SettingsPage;