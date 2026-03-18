# Coffee House - Giao Diện Người Dùng (Frontend SPA)

Nền tảng Frontend ReactJS của hệ thống **Coffee House Management System** cung cấp trải nghiệm Single Page Application (SPA) mượt mà không tải lại trang. Kiến trúc được phối hợp bằng **20 cụm chức năng UI** hiện đại để tối ưu hóa năng suất hoạt động của 3 cấp: Chủ quán (Owner) - Quản lý (Manager) - Nhân viên ca (Staff).

## Kiến Trúc UI/UX Phục Vụ 20 Chức Năng Cốt Lõi

Khác với các App quản trị thông thường, giao diện hệ thống này được xây dựng trên sự phân rã của các `Components` và `Redux Slices` theo các chức năng cụ thể:

### 1. Phân Hệ Đăng Nhập & Bảo Mật (`src/features/auth`)
1. **Split-Screen LoginUI:** Trang chủ đăng nhập được thiết kế rẽ đôi giao diện (50/50). Ảnh thương hiệu nổi bật 1 bên, Form Login 1 bên. Các Test Account được đính kèm sắn để BẤM TỰ ĐIỀN chữ tiết kiệm thời gian gõ phím.
2. **Quên & Đặt Lại Mật Khẩu (Password Portal):** Chuỗi Modal Dialog (Popup) chuyên nghiệp để gửi thư yêu cầu khôi phục, đảm bảo an toàn thao tác nhầm.
3. **Cá Nhân Hóa Hồ Sơ (Profile Layout):** Một không gian làm việc Card-based bằng kính (Glassmorphism), nổi bật các chỉ số cá nhân như tổng giờ làm, chức vụ, nút tự đổi password tiện lợi.

### 2. Phân Hệ Quản Trị Hệ Thống (`src/features/stores` & `users`)
4. **Master Dashboard (Owner/Manager View):** Trang trung tâm hiển thị trực quan các thẻ KIP (Thống kê DataCards), cùng hệ thống Charts (Biểu đồ vạch) và PieCharts sinh động giúp nắm bắt chi phí và nhân lực Real-Time.
5. **Cửa Sổ Cơ Sở Chi Nhánh (Stores Manager):** DataTable liệt kê cơ sở, tích hợp Search Box. Nút Action Mở Ngăn Kéo Sidebar mini để Sửa thông tin không cần đổi link trang.
6. **Màn Hình Điều Phối Nhân Viên (Staff Hub):** Công cụ đắc lực cho Manager chuyển điều nhân sự lính mới vào các Group chi nhánh bằng Select Box trực quan. Trang bị Filter lọc theo vị trí (Role).

### 3. Phân Hệ Quản Lý Ca Trực (`src/features/shifts`)
7. **Lưới Phân Ca Khung (Shift Template Grid):** Giao diện bảng (Spreadsheet-like) kéo thả hàng tuần. Manager bấm các checkbox Sáng, Trưa, Tối để tự động lưu khung.
8. **Màn Hình Lịch Đăng Ký (Staff Registration):** Nhân viên mở màn hình và đánh dấu (+) vào ô Thời khoá biểu để xin đi làm, giao diện Mobile-first chống bấm trượt trên màn hình nhỏ.
9. **Màn Hình Chốt Ca Cảnh Báo (Finalizing Dash):** Giao diện Check-List siêu việt. Box nào thiếu người sẽ Highlight vệt Đỏ cực gắt. Điểm danh đủ Staff thì Box tự bo Xanh báo hiệu đã chốt thành công lịch chính thức.
10. **Bảng Bấm Chấm Công Thời Gian Thực (Check-in Timer):** Một khối Widget luôn ghim trên đỉnh trang Layout chung (Header). Hiện đồng hồ điện tử đếm ngược/tiến. Staff bấm 1 chạm Check-in nhanh gọn ngay khi tới điểm làm.

### 4. Hệ Sinh Thái "Chợ Ca" (Marketplace) (`src/features/marketplace`)
11. **Sàn Giao Dịch Bán Ca (Market Feed):** Dạng danh sách New Feed (như Facebook). Ca nào bị nhân viên rớt trực sẽ hiển thị thành thẻ Card có nút "Nhượng".
12. **Bắt Ca Mở (Pickup Trigger):** Khi Staff khác lướt chợ thấy Card, họ nhấp đúp nút "Săn Ca" (Nhận). Màn hình bật cảnh báo Modal xác nhận, sau đó thẻ Card tự động bay khỏi bảng Feed của người khác.
13. **Hộp Thoại Đổi Ca (Swap Dialog):** Giao diện Dropdown thông minh - "Tôi đổi Ca A", Dropdown 2 - "Với Ca B của người này". Nộp đơn thành công gửi thông báo tới Manager trực tiếp.

### 5. Phân Hệ Vận Hành & Yêu Cầu (`src/features/requests`, `tasks`)
14. **Bảng Công Việc Kéo Thả (Kanban Task View):** Thiết kế dạng thẻ, giao việc của Manager cho Staff. Có Tooltip hướng dẫn mô tả. Staff check-V khi xong việc làm thanh Progress Bar (thanh tiến trình) nhảy số 100%.
15. **Hộp Đơn Xin Phép (Leave Request Form):** Giao diện biểu mẫu tĩnh (Wizard-Form). Chọn ngày, gõ lý do báo vắng mặt.
16. **Hệ Ticket Giải Quyết Thắc Mắc (Complaint Center):** Trải nghiệm UX như cửa sổ Nhắn Tin Hỗ Trợ. Nhân viên gõ lỗi tính lương, Quản lý nhìn thấy trong Inbox Ticket để phản hồi dòng Reply.
17. **Chuông Thông Báo (Noti Dropdown):** Góc trên phải Header có quả Chuông. Bấm xổ ra danh sách lịch sử tin nổi bật (VD "Ting Ting - Lương đã phát").

### 6. Phân Hệ Báo Cáo Tài Chính (`src/features/payroll`, `ranking`)
18. **Lưới Bảng Lương (Payroll Datagrid):** Phơi bày mọi file thu nhập. Excel-like Datagrid có thể phân loại theo Kì, lọc từ cao đến thấp số Lương Gross của Store.
19. **Thẻ Lương Cá Nhân (Personal Payslip):** Thay thế giấy in. Trình bày dạng biên lai bill đẹp mắt cho Staff check lại từng tiếng thừa/thiếu. Có chức năng Print (in pdf).
20. **Bảng Vàng Thi Đua (Ranking Leaderboard):** Layout thiết kế bảng vàng. Top 1, Top 2, Top 3 có Icon Cúp vàng lấp lánh (Gold Cup Icon) làm gamification thúc đẩy staff làm việc chuyên cần.

---

## Môi Trường Cài Đặt Khai Báo Frontend (Dành Cho React Developer / System Admin)

Để có thể Compile và chạy Server giả lập (Development Server) thành công ngay từ phút đầu, hãy tuân thủ Checklist sau:

### Yêu Cầu Môi Trường (System Specs)
- **Node.js**: Phải cài bản số chẵn LTS từ phiên bản `18.x` hoặc `20.x` (Tránh dùng bản Beta Lẻ gây lỗi Node-Sass hay babel).
- **Trình biên dịch quản lý gói**: `npm` (Mặc định đi với Node) hoặc `yarn`.
- IDE đề xuất: Visual Studio Code.

### Bước 1: Khởi Tạo File Biến Hệ Thống (`.env`)
Từ Terminal/CMD ở gốc dự án, hãy truy cập thư mục Frontend:
```bash
cd parrtime-staff-management/frontend
```
**Tạo File .env Động**: Spring Boot chạy API tĩnh trên port `8080/api/v1`. Bạn BẮT BUỘC tạo một tập tin tên là `.env` (chú ý có dấu chấm trước e) ở NGAY NGOÀI GỐC FOLDER `frontend`.
Thêm dòng code sau:
```env
# ĐÂY LÀ URL ĐẾN BỘ NÃO BACKEND
REACT_APP_API_URL=http://localhost:8080/api/v1
```
> *(Mẹo PowerShell để tự tạo file nhanh: `echo "REACT_APP_API_URL=http://localhost:8080/api/v1" > .env`)*

### Bước 2: Kéo Mã Nguồn Thư Viện Về Kho (Dependencies Install)
Khi chạy lệnh này, trình quản lý đọc nội dung file `package.json` và kéo khoảng vài trăm MB thư viện vào thư mục ẩn `node_modules`. Do dự án dùng nhiều biểu đồ (`recharts`) và Axios nên hãy chờ xíu.
```bash
npm install
```
*(Nếu cài đặt báo lỗi audit hoặc peer dependency vàng báo warning chéo, có thể ép lệnh bằng `npm install --legacy-peer-deps` để giải quyết)*.

### Bước 3: Launch Live Browser Server
Gõ lệnh để dịch JSX thành HTML/JS mộc và đẩy nó lên Localhost:
```bash
npm start
```

### ✨ Quan Sát Thành Công
Cửa sổ web mặc định hoặc mở tay Browser và điền: **`http://localhost:3000`**.
Nếu giao diện hiện màn hình XANH Trắng với hình ảnh Cà Phê chia đôi (Split Screen), cùng Form Đăng Nhập bên phải, chúc mừng bạn hệ thống UI đã hòa nhịp với Backend!

> Mẹo: Cứ mạnh dạn click vào các hàng Demo Account nhỏ trên form để hệ thống "Gõ Hộ" Username và Password vào các thẻ Input, bấm Enter để vút ngay vào Dashboard quản trị.
