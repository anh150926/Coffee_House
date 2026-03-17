import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { logout } from "../features/auth/authSlice";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
} from "../features/notifications/notificationSlice";
import authService from "../api/authService";

const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount, notifications, loading } = useSelector(
    (state: RootState) => state.notifications
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workScheduleExpanded, setWorkScheduleExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [pendingResetCount, setPendingResetCount] = useState(0);

  useEffect(() => {
    if (
      location.pathname === "/work-schedule" ||
      location.pathname === "/my-shifts" ||
      location.pathname === "/shift-registration" ||
      location.pathname === "/marketplace"
    ) {
      setWorkScheduleExpanded(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname === "/tasks" ||
      location.pathname === "/create-task-for-staff"
    ) {
      setTasksExpanded(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications());

    const fetchPendingResets = async () => {
      if (user?.role === "OWNER") {
        try {
          const res = await authService.getPasswordResetRequests();
          setPendingResetCount(res.data.length);
        } catch (_) {}
      }
    };
    fetchPendingResets();

    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
      dispatch(fetchNotifications());
      fetchPendingResets();
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch, user]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification) return;
    if (!notification.isRead) {
      await dispatch(markAsRead(notification.id));
      dispatch(fetchUnreadCount());
    }
    if (notification.link) navigate(notification.link);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "OWNER":
        return "badge-owner";
      case "MANAGER":
        return "badge-manager";
      default:
        return "badge-staff";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Chủ sở hữu";
      case "MANAGER":
        return "Quản lý";
      default:
        return "Nhân viên";
    }
  };

  const avatarUrl = user?.avatarUrl
    ? user.avatarUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.fullName || "U"
      )}&background=f97316&color=fff&bold=true`;

  /* ─── Page title helper ─── */
  const getPageMeta = () => {
    const map: Record<string, { title: string; sub: string }> = {
      "/dashboard": { title: "Tổng quan", sub: "" },
      "/users": { title: "Nhân viên", sub: "Quản lý tài khoản nhân viên" },
      "/stores": { title: "Cơ sở", sub: "Quản lý chi nhánh" },
      "/shifts": { title: "Lịch làm việc", sub: "Quản lý ca làm việc" },
      "/my-shifts": { title: "Ca của tôi", sub: "Lịch làm việc cá nhân" },
      "/shift-registration": { title: "Đăng ký ca", sub: "Đăng ký lịch làm" },
      "/marketplace": { title: "Chợ Ca", sub: "Trao đổi ca làm việc" },
      "/tasks": { title: "Nhiệm vụ", sub: "Quản lý công việc" },
      "/create-task-for-staff": { title: "Giao nhiệm vụ", sub: "Tạo nhiệm vụ cho nhân viên" },
      "/requests": { title: "Yêu cầu", sub: "Quản lý yêu cầu" },
      "/payrolls": { title: "Bảng lương", sub: "Quản lý lương" },
      "/my-payroll": { title: "Lương của tôi", sub: "Thông tin lương cá nhân" },
      "/reports": { title: "Báo cáo", sub: "Thống kê & phân tích" },
      "/rankings": { title: "Xếp hạng NV", sub: "Bảng xếp hạng nhân viên" },
      "/complaints": { title: "Khiếu nại", sub: "Quản lý khiếu nại" },
      "/notifications": { title: "Thông báo", sub: "Tin nhắn & cập nhật" },
      "/send-notification": { title: "Gửi thông báo", sub: "Gửi thông báo đến nhân viên" },
      "/profile": { title: "Hồ sơ", sub: "Thông tin cá nhân" },
      "/security": { title: "Bảo mật", sub: "Cài đặt bảo mật" },

      "/password-reset-requests": { title: "Cấp lại mật khẩu", sub: "Yêu cầu đặt lại mật khẩu" },
    };
    return map[location.pathname] || { title: "Coffee House", sub: "" };
  };

  const pageMeta = getPageMeta();

  return (
    <div>
      {/* ─── TOP NAVBAR ─────────────────────────────────── */}
      <nav className="topbar">
        {/* Brand */}
        <a className="topbar-brand" href="/dashboard">
          <div className="topbar-brand-icon">
            <i className="bi bi-cup-hot-fill" />
          </div>
          <div className="topbar-brand-text">
            <span className="topbar-brand-name">Coffee House</span>
            {user?.storeName && (
              <span className="topbar-brand-sub">{user.storeName}</span>
            )}
          </div>
        </a>

        {/* Search */}
        <div className="topbar-search">
          <i className="bi bi-search search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>

        {/* Actions */}
        <div className="topbar-actions">
          {/* Notification bell */}
          {(user?.role === "MANAGER" || user?.role === "STAFF") && (
            <div className="dropdown dropdown-notifications">
              <button
                className="topbar-icon-btn notification-bell-btn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: "1px solid var(--border)" }}
              >
                <i className="bi bi-bell notification-bell-icon" />
                {unreadCount > 0 && (
                  <span className="topbar-notif-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <div
                className="dropdown-menu dropdown-menu-end animated--fade-in-up"
                style={{ width: 320 }}
              >
                <div className="dropdown-header">
                  <i className="bi bi-bell" />
                  Thông báo
                </div>
                <div className="dropdown-divider" />
                {loading && (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border spinner-border-sm"
                      style={{ color: "var(--orange)" }}
                    />
                  </div>
                )}
                {!loading && notifications.length === 0 && (
                  <div className="empty-state py-3">
                    <i className="bi bi-bell-slash empty-state-icon" />
                    <span className="empty-state-text">Không có thông báo</span>
                  </div>
                )}
                {!loading &&
                  notifications.slice(0, 5).map((n) => (
                    <button
                      key={n.id}
                      className={`dropdown-item align-items-start ${
                        !n.isRead ? "fw-semibold" : ""
                      }`}
                      onClick={() => handleNotificationClick(n)}
                      style={{ whiteSpace: "normal", textAlign: "left" }}
                    >
                      <div
                        className="me-2 mt-1 flex-shrink-0"
                        style={{ color: n.isRead ? "var(--text-light)" : "var(--orange)" }}
                      >
                        <i className={`bi ${n.isRead ? "bi-bell" : "bi-bell-fill"}`} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-dark" style={{ fontSize: "0.825rem" }}>
                          {n.title}
                        </div>
                        {n.message && (
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {n.message}
                          </div>
                        )}
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {new Date(n.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </button>
                  ))}
                <div className="dropdown-divider" />
                <NavLink
                  to="/notifications"
                  className="dropdown-item justify-content-center"
                  style={{ color: "var(--orange)", fontWeight: 600, fontSize: "0.8rem" }}
                >
                  Xem tất cả thông báo
                </NavLink>
              </div>
            </div>
          )}

          {/* User menu */}
          <div className="dropdown">
            <button
              className="navbar-user-btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img className="navbar-user-avatar" src={avatarUrl} alt="avatar" />
              <i className="bi bi-chevron-down navbar-user-chevron d-none d-md-inline" />
            </button>
            <div
              className="dropdown-menu dropdown-menu-end animated--fade-in-up"
              style={{ minWidth: 220 }}
            >
              {/* User info header */}
              <div className="px-3 py-2 border-bottom" style={{ borderColor: "var(--border)" }}>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                      {user?.fullName}
                    </div>
                    <span className={`badge ${getRoleBadgeClass(user?.role || "")}`}>
                      {getRoleLabel(user?.role || "")}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "0.25rem 0" }}>
                <NavLink to="/profile" className="dropdown-item">
                  <i className="bi bi-person" />
                  Hồ sơ cá nhân
                </NavLink>
                <NavLink to="/security" className="dropdown-item">
                  <i className="bi bi-shield-lock" />
                  Bảo mật
                </NavLink>
                <NavLink to="/notifications-settings" className="dropdown-item">
                  <i className="bi bi-bell" />
                  Cài đặt thông báo
                </NavLink>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right" />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="topbar-icon-btn d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ marginLeft: "0.25rem" }}
          >
            <i className="bi bi-list" />
          </button>
        </div>
      </nav>

      {/* ─── SIDEBAR ────────────────────────────────────── */}
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        {/* Context label */}
        {user?.role === "MANAGER" && user?.storeName && (
          <div className="sidebar-context">
            <div className="sidebar-context-label">Chi nhánh</div>
            <div className="sidebar-context-value">{user.storeName}</div>
          </div>
        )}
        {user?.role === "OWNER" && (
          <div className="sidebar-context">
            <div className="sidebar-context-label">Portal</div>
            <div className="sidebar-context-value">Quản trị viên</div>
          </div>
        )}
        {user?.role === "STAFF" && (
          <div className="sidebar-context">
            <div className="sidebar-context-label">Nhân viên</div>
            <div className="sidebar-context-value">{user.storeName || "Coffee House"}</div>
          </div>
        )}

        <nav className="sidebar-nav">
          {/* Overview */}
          <NavLink
            to="/dashboard"
            className="nav-link"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-grid-1x2" />
            Tổng quan
          </NavLink>

          {/* OWNER section */}
          {user?.role === "OWNER" && (
            <>
              <div className="sidebar-section-label">Quản lý</div>
              <NavLink to="/users" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-people" />
                Nhân viên
              </NavLink>
              <NavLink to="/stores" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-shop" />
                Cơ sở
              </NavLink>
              <NavLink to="/shifts" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-calendar3" />
                Lịch làm việc
              </NavLink>
              <NavLink to="/marketplace" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-arrow-left-right" />
                Chợ Ca
              </NavLink>

              <div className="sidebar-section-label">Tài chính</div>
              <NavLink to="/payrolls" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-cash-stack" />
                Bảng lương
              </NavLink>
              <NavLink to="/reports" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-bar-chart-line" />
                Báo cáo
              </NavLink>

              <div className="sidebar-section-label">Vận hành</div>
              {/* Tasks with sub-menu */}
              <div className="nav-menu-item">
                <button
                  className={`nav-link nav-link-parent ${tasksExpanded ? "expanded" : ""}`}
                  onClick={() => setTasksExpanded(!tasksExpanded)}
                >
                  <i className="bi bi-list-check" />
                  <span style={{ flex: 1, textAlign: "left" }}>Nhiệm vụ</span>
                  <i className={`bi ms-auto ${tasksExpanded ? "bi-chevron-down" : "bi-chevron-right"}`} style={{ width: "auto", fontSize: "0.7rem" }} />
                </button>
                {tasksExpanded && (
                  <div className="nav-submenu">
                    <NavLink to="/create-task-for-staff" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-clipboard-plus" />
                      Giao nhiệm vụ
                    </NavLink>
                    <NavLink to="/tasks" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-table" />
                      Bảng nhiệm vụ
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink to="/requests" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-file-earmark-text" />
                Yêu cầu
              </NavLink>
              <NavLink to="/complaints" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-exclamation-circle" />
                Khiếu nại
              </NavLink>
              <NavLink to="/rankings" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-trophy" />
                Xếp hạng NV
              </NavLink>

              <div className="sidebar-section-label">Hệ thống</div>
              <NavLink to="/send-notification" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-send" />
                Gửi thông báo
              </NavLink>
              <NavLink
                to="/password-reset-requests"
                className="nav-link"
                onClick={() => setSidebarOpen(false)}
              >
                <i className="bi bi-key" />
                <span style={{ flex: 1 }}>Cấp lại mật khẩu</span>
                {pendingResetCount > 0 && (
                  <span className="badge-count">{pendingResetCount}</span>
                )}
              </NavLink>
            </>
          )}

          {/* MANAGER section */}
          {user?.role === "MANAGER" && (
            <>
              <div className="sidebar-section-label">Quản lý</div>
              <NavLink to="/users" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-people" />
                Nhân viên
              </NavLink>
              <NavLink to="/shifts" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-calendar3" />
                Lịch làm việc
              </NavLink>
              <NavLink to="/marketplace" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-arrow-left-right" />
                Chợ Ca
              </NavLink>

              <div className="sidebar-section-label">Vận hành</div>
              <div className="nav-menu-item">
                <button
                  className={`nav-link nav-link-parent ${tasksExpanded ? "expanded" : ""}`}
                  onClick={() => setTasksExpanded(!tasksExpanded)}
                >
                  <i className="bi bi-list-check" />
                  <span style={{ flex: 1, textAlign: "left" }}>Nhiệm vụ</span>
                  <i className={`bi ms-auto ${tasksExpanded ? "bi-chevron-down" : "bi-chevron-right"}`} style={{ width: "auto", fontSize: "0.7rem" }} />
                </button>
                {tasksExpanded && (
                  <div className="nav-submenu">
                    <NavLink to="/create-task-for-staff" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-clipboard-plus" />
                      Giao nhiệm vụ
                    </NavLink>
                    <NavLink to="/tasks" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-table" />
                      Bảng nhiệm vụ
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink to="/payrolls" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-cash-stack" />
                Bảng lương
              </NavLink>
              <NavLink to="/requests" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-file-earmark-text" />
                Yêu cầu
              </NavLink>
              <NavLink to="/complaints" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-exclamation-circle" />
                Khiếu nại
              </NavLink>

              <div className="sidebar-section-label">Thông báo</div>
              <NavLink to="/notifications" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-bell" />
                <span style={{ flex: 1 }}>Thông báo</span>
                {unreadCount > 0 && (
                  <span className="badge-count">{unreadCount}</span>
                )}
              </NavLink>
            </>
          )}

          {/* STAFF section */}
          {user?.role === "STAFF" && (
            <>
              <div className="sidebar-section-label">Ca làm việc</div>
              <div className="nav-menu-item">
                <button
                  className={`nav-link nav-link-parent ${workScheduleExpanded ? "expanded" : ""}`}
                  onClick={() => setWorkScheduleExpanded(!workScheduleExpanded)}
                >
                  <i className="bi bi-calendar-week" />
                  <span style={{ flex: 1, textAlign: "left" }}>Ca của tôi</span>
                  <i className={`bi ms-auto ${workScheduleExpanded ? "bi-chevron-down" : "bi-chevron-right"}`} style={{ width: "auto", fontSize: "0.7rem" }} />
                </button>
                {workScheduleExpanded && (
                  <div className="nav-submenu">
                    <NavLink to="/my-shifts" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-calendar-check" />
                      Lịch làm việc
                    </NavLink>
                    <NavLink to="/shift-registration" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-plus-circle" />
                      Đăng ký lịch làm
                    </NavLink>
                    <NavLink to="/marketplace" className="nav-link-sub" onClick={() => setSidebarOpen(false)}>
                      <i className="bi bi-arrow-left-right" />
                      Chợ Ca
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="sidebar-section-label">Công việc</div>
              <NavLink to="/tasks" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-list-check" />
                Nhiệm vụ
              </NavLink>
              <NavLink to="/requests" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-file-earmark-text" />
                Yêu cầu
              </NavLink>
              <NavLink to="/complaints" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-exclamation-circle" />
                Khiếu nại
              </NavLink>
              <NavLink to="/my-payroll" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-wallet2" />
                Lương của tôi
              </NavLink>

              <div className="sidebar-section-label">Khác</div>
              <NavLink to="/notifications" className="nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="bi bi-bell" />
                <span style={{ flex: 1 }}>Thông báo</span>
                {unreadCount > 0 && (
                  <span className="badge-count">{unreadCount}</span>
                )}
              </NavLink>
            </>
          )}
        </nav>

        {/* Bottom user info */}
        <div className="sidebar-footer">
          <NavLink to="/profile" className="sidebar-user" style={{ textDecoration: "none", marginBottom: "0.5rem" }} onClick={() => setSidebarOpen(false)}>
            <img className="sidebar-user-avatar" src={avatarUrl} alt="avatar" />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName}</div>
              <div className="sidebar-user-role">{getRoleLabel(user?.role || "")}</div>
            </div>
            <i className="bi bi-chevron-right" style={{ color: "var(--text-light)", fontSize: "0.7rem" }} />
          </NavLink>
          
          {/* Nút Đăng xuất */}
          <button 
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
            style={{ 
              backgroundColor: "#fff1f0", 
              color: "#dc3545", 
              border: "1px solid #ffccc7", 
              fontSize: "0.85rem",
              fontWeight: 500,
              padding: "0.4rem",
              borderRadius: "8px",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#ffccc7"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fff1f0"; }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: "1rem" }}></i>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ display: "block" }}
        />
      )}

      {/* ─── MAIN CONTENT ───────────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
