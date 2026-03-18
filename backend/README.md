# Coffee House - Backend Kiến Trúc & Dịch Vụ API

Dự án Backend đóng vai trò là lõi hệ thống xử lý nghiệp vụ, quản lý dữ liệu đa luồng (Database Management), cung cấp chuẩn giao tiếp RESTful API cho các client Frontend cũng như xử lý logic cốt lõi cho **20 tính năng quản lý nhân sự quán cà phê.**

## Kiến Trúc 20 Tính Năng Định Tuyến Backend (API Architecture)

Hệ thống được chia nhỏ thành các Service độc lập quản lý, tuân thủ nguyên lý thiết kế Model-View-Controller (tại API tầng Controller):

### 1. Phân Hệ Xác Thực Hệ Thống (Auth & Security - `/api/v1/auth`)
*Sử dụng **Spring Security 6** và **JJWT** tạo rào chắn vòng bảo mật ngoài.*
1. **AuthController (Đăng nhập):** Tiếp nhận thông tin, băm mật khẩu `BCrypt`, cấp Token JWT hạn sống linh hoạt. Hệ thống tự động Role Base Access Control 3 cấp quyền ngay ở filter (Owner, Manager, Staff).
2. **Password Recovery:** API `forgot-password`. Tạo token đổi mật khẩu dùng 1 lần (TTL 15 phút), cho phép Manager xác thực yêu cầu của Staff.
3. **Profile Service (`/api/v1/users/me`):** Logic lấy danh tính chủ Token (dựa vào UserDetailsService) để truyền trả thông tin chi nhánh về Client.

### 2. Dịch Vụ Hệ Thống Quản Trị (Core Management - `/api/v1/users`, `/api/v1/stores`)
4. **Dashboard Stats Builder:** Khối logic `DashboardService` tổng hợp các Query phức tạp (như tổng hợp ca trực tuần này, chi phí nhân sự tháng) thành Data Transfer Object (DTO) nhẹ nhất cho Owner/Manager xem dạng Real-time.
5. **Store API:** Xử lý logic vòng đời Cơ Sở (Create, Rename, Delete). Tự động chặn xóa cơ sở nếu vẫn còn số lượng nhân sự trực thuộc.
6. **Staff API:** Tạo tài khoản định danh, set up lương cơ bản mồi (Base Salary) và gán quan hệ khóa ngoại (`@ManyToOne`) với Store để phân luồng dữ liệu quản lý minh bạch cho Manager.

### 3. Động Cơ Lịch Trình Ca Làm (Shift Engine - `/api/v1/shift-templates`, `/api/v1/shifts`)
7. **Shift Template API:** API giúp Controller sinh hàng loạt các entity `ShiftTemplate` thành kho lưu trữ khung thời gian mặc định của chi nhánh.
8. **Shift Registration API:** Validation nhận vào thời gian đăng ký của Staff. Logic phải đảm bảo chỉ 1 Staff được đăng ký 1 khe (slot) thời gian trống trong 1 ngày, chống xung đột (race condition).
9. **Finalization Builder:** Service dùng để duyệt ca. Chuyển list Staff thành danh sách `ShiftUser` bám vào ca chốt lúc đó.
10. **TimeLog (Checkin/out) API (`/api/v1/timelogs`):** Nhận Timestamp từ Client. Kiểm tra ràng buộc cực chặt bằng logic chênh lệch giờ: Chặn check-in trước quá 15 phút hoặc Check-out muộn phi lí.

### 4. Hệ Sinh Thái "Chợ Ca" (Marketplace Services - `/api/v1/marketplace`)
11. **MarketTransfer API:** Logic biến đổi bảng trạng thái `MarketStatus` thành `OPEN`. Cho phép các query đọc dữ liệu lấy ca của người bán đẩy lên feed cho mọi người.
12. **MarketPickup API:** Xử lý giao dịch nhận ca. Yêu cầu tính `Transactional(rollbackFor=Exception.class)` giữa người Bán và Người Mua để chỉ cập nhật người trực sau khi Manager bấm OK.
13. **MarketSwap API:** Logic hoán đổi lịch giữa 2 nhân viên trong DB. Khi được duyệt, DB Update đồng loạt ID ca trực của Staff A qua B và B qua A.

### 5. Dịch Vụ Vận Hành Tương Tác (Operation Services)
14. **Leave Request API (`/api/v1/requests`):** Logic upload đơn xin phép, theo dõi Status (Pending/Approved/Rejected).
15. **Task Service (`/api/v1/tasks`):** Liên kết công việc với chi nhánh. Quản lý trạng thái đánh dấu 0% tới 100%.
16. **Complaint Service (`/api/v1/complaints`):** Sinh ticket cho Staff gửi thắc mắc 1 chiều về Manager.
17. **Notification Service (`/api/v1/notifications`):** Bắn object Alert vào bảng Notify mỗi khi xảy ra sự kiện quan trọng (VD: "Ca của bạn đã được chốt!").

### 6. Khối Dịch Vụ Lương Nâng Cao (Payroll Engine - `/api/v1/payrolls`, `/api/v1/reports`)
18. **Auto-Payroll Calc Service:** Logic quét toàn bộ `TimeLogs` của chi nhánh trong 1 chu kỳ thời gian. Lấy Tổng (Thời gian CheckOut - CheckIn) nhân với (Mức Base Rate Staff). Mức độ phức tạp vòng lặp được tối ưu (Batch processing).
19. **Payslip DTO Generation:** Dịch vụ sinh Bảng lương tổng quan cho Manager gửi đi Approval và tách riêng Payload thu nhập hiển thị tới App của Staff.
20. **Ranking & Chart API:** Query JPQL tối ưu gom nhóm (`GROUP BY`) lấy Top 10 nhân viên nhiều giờ làm nhất để xếp hạng khen thưởng hàng tháng. Lấy dữ liệu 6 tháng gần nhất thành mảng Array trả về cho ReactJS vẽ đồ thị tài chính.

---

## Môi Trường Cài Đặt Khai Báo Chi Tiết Chạy Backend

Để chạy Java Spring Boot, lập trình viên cần thiết lập chuẩn Environment theo luồng sau đây để tránh lỗi phổ biến với Lombok.

### Bước 1: Yêu Cầu Database (Tạo Lược Đồ, Flyway Tự Khởi Tạo Bảng)
Khởi chạy dịch vụ MySQL của bạn (Ví dụ bằng XAMPP hoặc cài rời).
Truy cập MySQL CLI bằng account Root:
```bash
mysql -u root -p
# Mật khẩu rỗng hoặc số bạn đã set
```
Sau đó tạo Database **(HÃY TẠO ĐÚNG TÊN DƯỚI ĐÂY)**:
```sql
CREATE DATABASE coffee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Thiết lập Application.yml (Nơi Cấu Hình Dòng Chảy)
Mở cây thư mục: `src/main/resources/application.yml`. Trọng Tâm 2 cấu hình sau phải thay đổi:

#### 2.1 Cấu Hình SQL Credentials MySQL
Chỉnh `username` và `password` theo giá trị đúng của MySQL máy bạn. Spring mặc định đọc biến môi trường `$DB_USERNAME`, nếu không có sẽ lấy `root`.
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/coffee_management?serverTimezone=Asia/Ho_Chi_Minh
    username: ${DB_USERNAME:root}       # ĐỔI THÀNH USER CỦA BẠN (VD DỰ PHÒNG: root)
    password: ${DB_PASSWORD:mypassword} # ĐỔI THÀNH PASS CỦA BẠN (VD DỰ PHÒNG: rỗng hoặc mypassword)
```

#### 2.2 Cấu Hình Secret Bảo Mật JWT Khóa Mã Hóa
Cần một cụm chuỗi bảo mật siêu dài (ít nhất 256 ký tự Base64) để chống tấn công Token. (Không cần đổi trừ khi Deploy lễn môi trường Prod thật).
```yaml
jwt:
  secret: ${JWT_SECRET:mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLong1234567890abcdef}
  expiration: 86400000 # 24 tiếng hết hạn
```

### Bước 3: Sửa Lỗi Tương Thích Lombok Khi Biên Dịch (VSCode / PowerShell)

**💡Lưu Ý Cực Kỳ Quan Trọng:** Code được cấu hình bắt buộc xài **JDK 21**. Nếu máy tính của bạn cài cả Java 24 thì Lombok Annotation (`@Data`, `@Getter`) sẽ bị báo lỗi "Unknown type" dẫn đến Build fail.

Trỏ Java_Home trực tiếp vào JDK 21 trước khi build bằng Terminal / PowerShell:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"  # Thay đường dẫn thực tế của JDK 21
```

*(Nếu xài VSCode, đổi file `frontend/.vscode/settings.json` bằng đoạn dưới)*:
```json
{
  "java.jdt.ls.java.home": "C:\\Program Files\\Java\\jdk-21"
}
```

### Bước 4: Launching / Chạy Server
Tại thư mục gốc dự án Backend `cd backend`.

Phục vụ Tải Thư Viện dependencies:
```bash
mvn clean install -DskipTests
```

Chạy Live Application (Server Tomcat nhúng):
```bash
mvn spring-boot:run
```

Chờ 15s. Bạn sẽ thấy Flyway SQL Script (`V1...` / `V2...`) tự động đẩy 30 Tables kèm tài khoản mẫu khởi tạo lên DB `coffee_management`. Server Online tại cổng **`8080`**.

---

## 📚 API System Flow (Tài Liệu REST API Dành Sinh Viên/Tester)

Truy cập trang Swagger Auto-Generated thông minh và dùng nút **Try It Out** để gọi thư trực tiếp:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Quy Trình Kích Hoạt Quyền Postman/Swagger
1. Chọn Controller `AuthController` ➜ Gọi hàm `POST /api/v1/auth/login`.
2. Truyền Body (VD mẫu Manager): `{"username":"managerA", "password":"password123"}`
3. Copy đoạn String **AccessToken** màu cam.
4. Trên đỉnh Web Swagger bấm nút **Authorize (Hình ổ khóa)**, dán mã `Bearer [Khoảng Cách] [Cụm AccessToken]`.
5. Sau đó tất cả các Endpoint như chức năng "Chấm Công", "Lương"... đều hoạt động thông suốt với vai trò của Manager!
