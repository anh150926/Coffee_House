import React from 'react';
import ProfileTabs from '../components/ProfileTabs';

const Billing: React.FC = () => {
  return (
    <ProfileTabs>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card card-coffee h-100 border-start-lg border-start-primary">
            <div className="card-body">
              <div className="small text-muted">Gói cước hiện tại</div>
              <div className="h3">Miễn phí</div>
              <a className="text-arrow-icon small text-primary" href="#!">
                Nâng cấp gói cước
                <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card card-coffee h-100 border-start-lg border-start-success">
            <div className="card-body">
              <div className="small text-muted">Hóa đơn tiếp theo</div>
              <div className="h3">0đ</div>
              <a className="text-arrow-icon small text-success" href="#!">
                Lịch sử thanh toán
                <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="card card-coffee mb-4">
        <div className="card-header">Lịch sử thanh toán</div>
        <div className="card-body p-0">
          <div className="table-responsive table-billing-history">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th className="border-gray-200" scope="col">Mã giao dịch</th>
                  <th className="border-gray-200" scope="col">Ngày</th>
                  <th className="border-gray-200" scope="col">Số tiền</th>
                  <th className="border-gray-200" scope="col">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#39201</td>
                  <td>15/06/2023</td>
                  <td>0đ</td>
                  <td><span className="badge bg-success">Thành công</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProfileTabs>
  );
};

export default Billing;
