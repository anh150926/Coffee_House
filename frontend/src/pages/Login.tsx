import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { login, clearError } from "../features/auth/authSlice";
import authService from "../api/authService";
import Toast from "../components/Toast";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      dispatch(login({ username, password }));
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      setForgotLoading(true);
      const res = await authService.forgotPassword(forgotEmail);
      setToast({ show: true, message: res.message || 'Yêu cầu đã được gửi.', type: 'success' });
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (error: any) {
      setToast({ show: true, message: error.response?.data?.message || 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setForgotLoading(false);
    }
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="login-split-page">

      {/* ── Left: image + brand overlay ─────────────────────── */}
      <div className="login-image-side">
        <div className="login-image-brand">
          <div className="login-image-brand-logo">
            <i className="bi bi-cup-hot-fill"></i>
          </div>
          <div className="login-image-brand-name">
            Coffee House<br/>Management
          </div>
          <div className="login-image-brand-tagline">
            Hệ thống quản lý nhân viên toàn diện
          </div>
          <div className="login-image-pills">
            <span className="login-image-pill"><i className="bi bi-people me-1"></i>Nhân viên</span>
            <span className="login-image-pill"><i className="bi bi-graph-up me-1"></i>Báo cáo</span>
            <span className="login-image-pill"><i className="bi bi-calendar3 me-1"></i>Ca làm việc</span>
          </div>
        </div>
      </div>

      {/* ── Right: form ─────────────────────────────────────── */}
      <div className="login-form-side">
        <div className="login-form-container">

          {/* Brand header */}
          <div className="login-brand-header">
            <div className="login-brand-icon">
              <i className="bi bi-cup-hot-fill"></i>
            </div>
            <div className="login-modern-title">Coffee House</div>
            <div className="login-modern-subtitle">
              Hệ Thống Quản Lý<br/>Nhân Viên
            </div>
          </div>

          {/* Form card */}
          <div className="login-card">

            {error && (
              <div className="login-alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="login-input-group">
                <label className="login-input-label" htmlFor="username">
                  Tên đăng nhập
                </label>
                <div className="login-input-wrap">
                  <i className="bi bi-person login-input-icon"></i>
                  <input
                    id="username"
                    type="text"
                    className="login-input"
                    placeholder="Nhập tài khoản của bạn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-input-group">
                <label className="login-input-label" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="login-input-wrap">
                  <i className="bi bi-lock login-input-icon"></i>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right"></i>
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            {/* Forgot password */}
            <div className="login-link-row">
              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => setShowForgotModal(true)}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Hotline */}
            <div className="login-hotline">
              Hotline hỗ trợ: <span>0336 112 173</span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="login-demo-box">
            <div className="login-demo-title">
              <i className="bi bi-info-circle"></i>
              Tài khoản demo
            </div>
            <div
              className="login-demo-row"
              onClick={() => fillDemo("owner", "password123")}
              title="Click để điền tự động"
            >
              <span className="login-demo-badge">Owner</span>
              <span className="login-demo-creds">owner / password123</span>
            </div>
            <div
              className="login-demo-row"
              onClick={() => fillDemo("managerA", "password123")}
              title="Click để điền tự động"
            >
              <span className="login-demo-badge manager">Manager</span>
              <span className="login-demo-creds">managerA / password123</span>
            </div>
            <div
              className="login-demo-row"
              onClick={() => fillDemo("staff_a01", "password123")}
              title="Click để điền tự động"
            >
              <span className="login-demo-badge staff">Staff</span>
              <span className="login-demo-creds">staff_a01 / password123</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          Hệ thống quản lý Coffee House<br/>
          &copy; {new Date().getFullYear()} CH
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Quên mật khẩu</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)}></button>
              </div>
              <div className="modal-body pt-3 pb-4">
                <p className="text-muted small mb-4">
                  Vui lòng nhập email đã đăng ký. Yêu cầu cấp lại mật khẩu sẽ được gửi đến Chủ cửa hàng.
                </p>
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="form-label text-dark fw-medium small">Email của bạn</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="VD: staff@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light" onClick={() => setShowForgotModal(false)} disabled={forgotLoading}>
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-coffee" disabled={forgotLoading || !forgotEmail}>
                      {forgotLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang gửi...
                        </>
                      ) : 'Gửi yêu cầu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;
