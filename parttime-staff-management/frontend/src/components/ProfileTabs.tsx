import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface ProfileTabsProps {
  children?: React.ReactNode;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="container-fluid px-4 mt-4">
      {/* Page Header */}
      <h2 className="mt-4 mb-4 text-dark font-weight-bold">Cài đặt tài khoản</h2>

      {/* Tabs */}
      <nav className="nav mb-4 bg-white rounded-3 px-3 pt-2" style={{ boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.05)', border: '1px solid #e3e6f0' }}>
        <NavLink 
          to="/profile" 
          className="nav-link ms-0"
          style={{ 
            color: '#4e73df', 
            borderBottom: currentPath === '/profile' ? '2px solid #4e73df' : '2px solid transparent', 
            padding: '0.75rem 1rem',
            fontWeight: currentPath === '/profile' ? 500 : 400
          }}
        >
          Hồ sơ
        </NavLink>

        <NavLink 
          to="/security" 
          className="nav-link"
          style={{ 
            color: '#4e73df', 
            borderBottom: currentPath === '/security' ? '2px solid #4e73df' : '2px solid transparent', 
            padding: '0.75rem 1rem',
            fontWeight: currentPath === '/security' ? 500 : 400
          }}
        >
          Bảo mật
        </NavLink>

        <NavLink 
          to="/notifications-settings" 
          className="nav-link"
          style={{ 
            color: '#4e73df', 
            borderBottom: currentPath === '/notifications-settings' ? '2px solid #4e73df' : '2px solid transparent', 
            padding: '0.75rem 1rem',
            fontWeight: currentPath === '/notifications-settings' ? 500 : 400
          }}
        >
          Thông báo
        </NavLink>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default ProfileTabs;
