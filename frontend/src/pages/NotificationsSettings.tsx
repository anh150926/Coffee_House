import React from 'react';
import ProfileTabs from '../components/ProfileTabs';

const NotificationsSettings: React.FC = () => {
  return (
    <ProfileTabs>
      <div className="row">
        <div className="col-lg-8">
          <div className="card card-coffee mb-4">
            <div className="card-header">Tùy chọn Email</div>
            <div className="card-body">
              <form>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="radioUsage" id="radioUsage1" defaultChecked />
                  <label className="form-check-label" htmlFor="radioUsage1">Tự động báo cáo sự cố hàng tuần</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="radioUsage" id="radioUsage2" />
                  <label className="form-check-label" htmlFor="radioUsage2">Báo cáo hiệu suất hàng tháng</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="radioUsage" id="radioUsage3" />
                  <label className="form-check-label" htmlFor="radioUsage3">Chỉ khi có lỗi nghiêm trọng</label>
                </div>
              </form>
            </div>
          </div>
          <div className="card card-coffee mb-4">
            <div className="card-header">Thông báo đẩy (Push)</div>
            <div className="card-body">
              <form>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1" defaultChecked />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault1">Tin nhắn mới</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault2" defaultChecked />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault2">Phân công việc mới</label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault3" />
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault3">Khuyến mãi & Cập nhật</label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProfileTabs>
  );
};

export default NotificationsSettings;
