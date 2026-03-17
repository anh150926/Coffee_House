import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import authService from '../api/authService';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

interface PasswordResetRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  storeName: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const PasswordResetRequests: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ show: false, message: '', type: 'success' });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await authService.getPasswordResetRequests();
      setRequests(res.data);
    } catch (error: any) {
      setToast({ show: true, message: error.response?.data?.message || 'Có lỗi khi tải danh sách yêu cầu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'OWNER') {
      fetchRequests();
    }
  }, [user]);

  const handleApproveClick = (req: PasswordResetRequest) => {
    setSelectedRequest(req);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowApproveModal(true);
  };

  const handleRejectClick = (req: PasswordResetRequest) => {
    setSelectedRequest(req);
    setShowRejectModal(true);
  };

  const submitApprove = async () => {
    if (!selectedRequest) return;
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setActionLoading(true);
      const res = await authService.approvePasswordReset(selectedRequest.id, newPassword);
      setToast({ show: true, message: res.message || 'Cấp lại mật khẩu thành công', type: 'success' });
      setShowApproveModal(false);
      fetchRequests();
    } catch (error: any) {
      setToast({ show: true, message: error.response?.data?.message || 'Lỗi khi cấp mật khẩu', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const submitReject = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      const res = await authService.rejectPasswordReset(selectedRequest.id);
      setToast({ show: true, message: res.message || 'Đã từ chối yêu cầu', type: 'success' });
      setShowRejectModal(false);
      fetchRequests();
    } catch (error: any) {
      setToast({ show: true, message: error.response?.data?.message || 'Lỗi khi từ chối yêu cầu', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (user?.role !== 'OWNER') {
    return <div className="container-fluid py-4"><div className="alert alert-danger">Bạn không có quyền truy cập trang này.</div></div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold text-dark">
            <i className="bi bi-key me-2 text-coffee"></i>
            Yêu cầu cấp lại mật khẩu
          </h2>
          <p className="text-muted mt-1 mb-0">Quản lý các yêu cầu quên mật khẩu từ nhân viên</p>
        </div>
        <button className="btn btn-outline-coffee" onClick={fetchRequests} disabled={loading}>
          <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'auth-spin' : ''}`}></i>
          Làm mới
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <tr>
                  <th className="px-4 py-3 border-0">Nhân viên</th>
                  <th className="py-3 border-0">Vai trò</th>
                  <th className="py-3 border-0">Cơ sở</th>
                  <th className="py-3 border-0">Thời gian yêu cầu</th>
                  <th className="py-3 border-0">Trạng thái</th>
                  <th className="px-4 py-3 border-0 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="spinner-border text-coffee" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="bi bi-check-circle display-4 text-success mb-3 d-block"></i>
                      Không có yêu cầu cấp lại mật khẩu nào đang chờ duyệt.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3 bg-light text-coffee fw-bold" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            {req.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{req.userName}</div>
                            <div className="small text-muted">{req.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`badge ${req.userRole === 'MANAGER' ? 'bg-primary' : 'bg-secondary'}`}>
                          {req.userRole === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}
                        </span>
                      </td>
                      <td className="py-3 text-dark">{req.storeName || <span className="text-muted">Không có</span>}</td>
                      <td className="py-3 text-dark">{new Date(req.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="py-3">
                        <span className="badge bg-warning text-dark"><i className="bi bi-hourglass-split me-1"></i>Chờ xử lý</span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button 
                          className="btn btn-sm btn-outline-success me-2 rounded-pill px-3"
                          onClick={() => handleApproveClick(req)}
                        >
                          <i className="bi bi-check-lg me-1"></i> Cấp mật khẩu
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleRejectClick(req)}
                        >
                          <i className="bi bi-x-lg me-1"></i> Từ chối
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title"><i className="bi bi-shield-lock me-2"></i>Cấp Mật Khẩu Mới</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowApproveModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info border-0 bg-light">
                  <div className="d-flex align-items-center mb-2">
                    <strong>Nhân viên:</strong> <span className="ms-2">{selectedRequest.userName}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <strong>Email:</strong> <span className="ms-2">{selectedRequest.userEmail}</span>
                  </div>
                </div>
                
                {passwordError && (
                  <div className="alert alert-danger py-2 border-0 small"><i className="bi bi-exclamation-circle me-2"></i>{passwordError}</div>
                )}
                
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Nhập mật khẩu mới</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Xác nhận mật khẩu</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu để xác nhận"
                  />
                  <div className="form-text mt-2"><i className="bi bi-info-circle me-1"></i>Mật khẩu này sẽ được đặt làm mật khẩu đăng nhập mới cho nhân viên.</div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 pb-4 px-4">
                <button type="button" className="btn btn-light px-4" onClick={() => setShowApproveModal(false)} disabled={actionLoading}>Hủy</button>
                <button type="button" className="btn btn-success px-4" onClick={submitApprove} disabled={actionLoading}>
                  {actionLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</> : 'Cấp mật khẩu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <ConfirmModal
        show={showRejectModal}
        title="Từ chối yêu cầu"
        message={`Bạn có chắc chắn muốn từ chối yêu cầu cấp lại mật khẩu của nhân viên ${selectedRequest?.userName}?`}
        confirmText="Từ chối yêu cầu"
        confirmButtonClass="btn-danger"
        onConfirm={submitReject}
        onCancel={() => setShowRejectModal(false)}
      />

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default PasswordResetRequests;
