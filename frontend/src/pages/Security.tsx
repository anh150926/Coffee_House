import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { updatePassword, setNeedPasswordChange } from '../features/auth/authSlice';
import authService from '../api/authService';
import Toast from '../components/Toast';
import ProfileTabs from '../components/ProfileTabs';

const Security: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ show: true, message: 'Mật khẩu mới không khớp!', type: 'error' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setToast({ show: true, message: 'Mật khẩu phải có ít nhất 6 ký tự!', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (user?.needPasswordChange) {
        await authService.changeInitialPassword(passwordData.currentPassword, passwordData.newPassword);
        dispatch(setNeedPasswordChange(false));
      } else {
        await dispatch(updatePassword({ 
          currentPassword: passwordData.currentPassword, 
          newPassword: passwordData.newPassword 
        })).unwrap();
      }
      
      setToast({ show: true, message: 'Đổi mật khẩu thành công!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setToast({ show: true, message: error.response?.data?.message || error.message || 'Có lỗi xảy ra', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <ProfileTabs>
      <div className="row">
        <div className="col-xl-8">
          <div className="card card-coffee mb-4">
            <div className="card-header">
              <i className="bi bi-shield-lock me-2"></i>
              Đổi mật khẩu
            </div>
            <div className="card-body">
              {user?.needPasswordChange && (
                <div className="alert alert-warning mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Bạn cần đổi mật khẩu mặc định để tiếp tục sử dụng hệ thống an toàn hơn.
                </div>
              )}
              
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="newPassword">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý...</>
                  ) : (
                    'Lưu mật khẩu'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </ProfileTabs>
  );
};

export default Security;
