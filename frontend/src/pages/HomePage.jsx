import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NIM-ENG</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Tính năng
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Cách hoạt động
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Bảng giá
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Vào Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Đăng ký miễn phí
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span>Hệ thống AI Research & Analysis</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Nghiên cứu thông minh với
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Agents</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Tự động hóa quy trình nghiên cứu, phân tích dữ liệu và tạo báo cáo chuyên nghiệp 
            với sức mạnh của Multi-Agent AI System
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              Bắt đầu miễn phí →
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold transition-all"
            >
              Xem demo
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            ✨ Không cần thẻ tín dụng • 🚀 Dùng thử 14 ngày miễn phí
          </p>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl border border-gray-200">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống AI đa tác vụ giúp bạn nghiên cứu và phân tích hiệu quả hơn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách hoạt động
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quy trình đơn giản, kết quả chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn nhà nghiên cứu đang sử dụng AI để tăng tốc công việc
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition-all hover:scale-105"
          >
            Đăng ký miễn phí ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">NIM-ENG</span>
              </div>
              <p className="text-gray-600 text-sm">
                Hệ thống AI Research & Analysis thông minh
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Tính năng</a></li>
                <li><a href="#" className="hover:text-gray-900">Bảng giá</a></li>
                <li><a href="#" className="hover:text-gray-900">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Công ty</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Pháp lý</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Điều khoản</a></li>
                <li><a href="#" className="hover:text-gray-900">Bảo mật</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookie</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2024 NIM-ENG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "🔍",
    title: "Research Agent",
    description: "Tự động thu thập và tổng hợp thông tin từ nhiều nguồn đáng tin cậy"
  },
  {
    icon: "📊",
    title: "Analysis Agent",
    description: "Phân tích dữ liệu sâu với machine learning và statistical methods"
  },
  {
    icon: "📝",
    title: "Synthesis Agent",
    description: "Tổng hợp và tạo báo cáo chuyên nghiệp từ kết quả nghiên cứu"
  },
  {
    icon: "🤖",
    title: "Multi-Agent System",
    description: "Các AI agents phối hợp làm việc để đạt hiệu quả tối ưu"
  },
  {
    icon: "📚",
    title: "Knowledge Base",
    description: "Quản lý và tổ chức tài liệu, dữ liệu nghiên cứu tập trung"
  },
  {
    icon: "⚡",
    title: "Real-time Processing",
    description: "Xử lý và cập nhật kết quả theo thời gian thực"
  }
];

const steps = [
  {
    title: "Upload tài liệu",
    description: "Tải lên các tài liệu, dữ liệu cần nghiên cứu và phân tích"
  },
  {
    title: "AI xử lý",
    description: "Hệ thống AI agents tự động phân tích và tổng hợp thông tin"
  },
  {
    title: "Nhận báo cáo",
    description: "Nhận báo cáo chi tiết, insights và recommendations"
  }
];

export default HomePage;
