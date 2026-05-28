import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { level: 0, text: "", color: "" },
      { level: 1, text: "Yếu", color: "bg-red-500" },
      { level: 2, text: "Trung bình", color: "bg-amber-500" },
      { level: 3, text: "Mạnh", color: "bg-teal-500" },
      { level: 4, text: "Rất mạnh", color: "bg-emerald-500" },
    ];
    return levels[strength];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  const fields = [
    {
      key: "name",
      label: "Họ tên",
      type: "text",
      icon: User,
      placeholder: "Nguyễn Văn A",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      icon: Mail,
      placeholder: "you@example.com",
    },
    {
      key: "password",
      label: "Mật khẩu",
      type: "password",
      icon: Lock,
      placeholder: "Tối thiểu 8 ký tự",
      showPassword: showPassword,
      toggleShowPassword: () => setShowPassword(!showPassword),
    },
    {
      key: "confirmPassword",
      label: "Xác nhận mật khẩu",
      type: "password",
      icon: Lock,
      placeholder: "••••••••",
      showPassword: showConfirmPassword,
      toggleShowPassword: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-teal-500 opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Branding */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NIM Research</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tạo tài khoản</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Họ tên
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all placeholder-slate-400"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all placeholder-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all placeholder-slate-400"
                  placeholder="Tối thiểu 8 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.level / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      {form.password.length >= 8 ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 border border-slate-300 rounded"></div>
                      )}
                      <span>Tối thiểu 8 ký tự</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[a-z]/.test(form.password) &&
                      /[A-Z]/.test(form.password) ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 border border-slate-300 rounded"></div>
                      )}
                      <span>Chữ hoa và chữ thường</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/\d/.test(form.password) ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 border border-slate-300 rounded"></div>
                      )}
                      <span>Ít nhất một số</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:border-transparent transition-all placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo tài khoản...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">HOẶC</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 NIM Research. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;