# ☕ Coffee House — Hệ Thống Quản Lý Nhân Viên Bán Thời Gian

**Coffee House Management System** là một nền tảng phần mềm toàn diện (Full-stack Web Application) được thiết kế đặc thù cho chuỗi quán cà phê nhằm tối ưu hóa bài toán quản lý nhân sự Part-time. Hệ thống giải quyết triệt để các vấn đề: xếp lịch làm việc linh hoạt, tính lương tự động, giao tiếp nội bộ và minh bạch hóa quy trình nhượng/đổi ca qua hình thức "Chợ Ca".

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?style=flat-square&logo=springboot)
![Java](https://img.shields.io/badge/Java-21+-ED8B00?style=flat-square&logo=openjdk)
![TiDB](https://img.shields.io/badge/TiDB-Cloud-FF4081?style=flat-square)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)

---

## 📋 Mục Lục

1. [Phân Tích Chi Tiết 20 Chức Năng Cốt Lõi](#1-phân-tích-chi-tiết-20-chức-năng-cốt-lõi)
2. [Cấu Trúc Giải Pháp & Công Nghệ](#2-cấu-trúc-giải-pháp--công-nghệ)
3. [Kiến Trúc Triển Khai (Deployment Architecture)](#3-kiến-trúc-triển-khai-deployment-architecture)
4. [Hướng Dẫn Cài Đặt Local (Setup Guide)](#4-hướng-dẫn-cài-đặt-local-setup-guide)
5. [Hướng Dẫn Triển Khai Production](#5-hướng-dẫn-triển-khai-production)
6. [Tài Khoản Demo Hệ Thống](#6-tài-khoản-demo-hệ-thống)

---

## 1. Phân Tích Chi Tiết 20 Chức Năng Cốt Lõi

Khác với các ứng dụng công sở giờ hành chính, hệ thống này được đúc kết từ nghiệp vụ thực tế ngành F&B. Sau đây là phân tích chi tiết quy trình vận hành của 20 chức năng:

### Nhóm 1: Tài Khoản & Bảo Mật (Account & Security)
1. **Đăng nhập & Xác thực bảo mật (Authentication & Authorization):**
   - Phân quyền theo 3 cấp: **Owner** (toàn quyền, xem được mọi chi nhánh), **Manager** (vận hành chi nhánh được giao), **Staff** (thực thi công việc).
   - Sử dụng cơ chế JSON Web Token (JWT) không trạng thái (stateless) giúp ứng dụng phản hồi nhanh và bảo mật trước các đợt mở rộng quy mô.
   - Giao diện đăng nhập Split-Screen thông minh.

2. **Quản lý Vòng đời Mật khẩu (Password Management):**
   - Nhân viên khi quên mật khẩu tiến hành gửi Yêu cầu qua màn hình ngoài.
   - Owner/Manager vào hệ thống xét duyệt và cấp quyền tái tạo mật khẩu. Staff có quyền đổi mật khẩu cá nhân bất kỳ lúc nào để đảm bảo tính riêng tư.

3. **Hồ Sơ Cá Nhân (User Profile):**
   - Không gian cá nhân hóa của nhân viên. Nơi quản lý thông tin liên hệ, xem thông tin vị trí công việc và chi nhánh đang trực thuộc.

### Nhóm 2: Quản Trị Hệ Thống & Nhân Sự (System & HR)
4. **Bảng Điều Khiển Quản Trị Trung Tâm (Master & Manager Dashboards):**
   - **Với Owner:** Xem tổng quan toàn chuỗi (biểu đồ doanh số, chi phí lương).
   - **Với Manager:** Báo cáo thời gian thực khối lượng công việc, ca trực còn trống, tình trạng nhân sự trong ngày của riêng chi nhánh mình.

5. **Quản Lý Chuỗi Cơ Sở (Store Management):**
   - Owner có chức năng thêm mới các điểm bán, gán định vị, cập nhật thông tin và điều phối Manager giám sát độc lập từng cơ sở.

6. **Hệ Quản Trị Nhân Sự Khép Kín (Staff Management):**
   - Quá trình Onboarding: Thêm mới tài khoản nhân viên, gán thẳng vào cơ sở để giới hạn phạm vi truy xuất dữ liệu. Tính năng tìm kiếm mạnh mẽ hỗ trợ quản lý quy mô hàng trăm nhân sự.

### Nhóm 3: Vận Hành Ca Trực (Shift Operations)
7. **Xây Dựng Khung Ca Mẫu (Shift Template Engine):**
   - Thay vì tạo tay từng ca, Manager thiết lập một "Bộ Khung Tuần" (ví dụ: Ca Sáng, Chiều, Tối với số lượng nhân lực tối thiểu cần có). Bộ khung này tái sử dụng để sinh ra lịch tự động hàng tuần.

8. **Cổng Đăng Ký Ca Mở (Open Shift Registration):**
   - Đầu tuần, hệ thống mở cổng. Các Staff truy cập xem lịch và chủ động đánh dấu "Đăng ký" vào các khoảng thời gian bản thân rảnh rỗi dựa vào khung ca của Manager.

9. **Quy Trình Đối Chiếu & Chốt Ca (Shift Finalization):**
   - Khi hết hạn đăng ký, Manager mở màn hình đối chiếu. Hệ thống sẽ cảnh báo (đỏ) những ca thiếu nhân sự để ưu tiên xử lý. Mọi ca được chốt sẽ trở thành Lịch làm việc chính thức.

10. **Chấm Công Mốc Thời Gian (Time-Tracking/Check-in):**
    - Thay thế máy chấm công thẻ/nhận diện. Staff đăng nhập hệ thống bấm "Check-in" khi tới quán và "Check-out" khi về. Lịch sử chấm giờ này là căn cứ cốt lõi tính lương.

### Nhóm 4: Hệ Sinh Thái "Chợ Ca" (Shift Marketplace)
*Được thiết kế linh hoạt cho tính chất Part-time, giúp Staff tối đa hóa thu nhập hoặc chủ động nghỉ phép linh động.*

11. **Đăng Bán/Nhượng Ca (Market - Transfer):**
    - Staff lỡ có việc đột xuất trong ca đã chốt có quyền đẩy lịch của mình lên Chợ Ca.

12. **Nhận Ca Khách (Market - Pickup):**
    - Mọi Staff cùng hệ thống thấy các ca đang trống (trên Chợ) có quyền bấm đăng ký nhận thêm để kiếm thêm giờ làm. Hệ thống sau đó trình Manager phê chuẩn sự chuyển giao.

13. **Đổi Ca Chéo (Market - Swap):**
    - Staff A có thể đề xuất 1-đổi-1 cho Staff B nếu cả hai cùng thỏa thuận được lịch. Manager chốt cuối để lịch được ghi đè tự động.

### Nhóm 5: Tương Tác Nội Bộ (Internal Communication)
14. **Quản Lý Yêu Cầu Nghỉ Phép (Leave Requests):**
    - Cổng số hóa thay cho xin nghỉ miệng. Staff trình đơn có lý do, thời gian. Lịch sử được lưu trữ chống khiếu nại về sau.

15. **Hệ Thống Phân Việc (Task Assignments):**
    - Manager không chỉ phân ca mà còn giao "Việc trong ca" (VD: dọn kho hỏng, lau kính ngoài). Có checkbox theo dõi tiến trình (To-do / Done).

16. **Cổng Phản Hồi Giải Quyết Khiếu Nại (Complaint & Help Desk):**
    - Nếu Staff check-in lỗi hoặc sai lương, họ mở Ticket Khiếu nại. Manager phản hồi trong ticket như app Chat hỗ trợ.

17. **Hệ Thống Cảnh Báo Real-time (Notifications):**
    - Báo Popup nổi khi: Duyệt ca thành công, Lương được xuất, có thông báo mới từ Owner đổ xuống.

### Nhóm 6: Tài Chính Lương Thưởng (Financials & Payroll)
18. **Thuật Toán Tính Lương (Payroll Engine):**
    - Tự động lấy số Tiếng check-in thực tế nhân (x) mức lương cơ bản (Base Rate) + Cộng thưởng phạt = Lương gross đề xuất.

19. **Phê Duyệt Khép Kín & Phiếu Lương In (Payslip Approval):**
    - Manager Tạo Bảng Lương → Owner Xem & Ký Duyệt cuối.
    - Staff sẽ nhận được Phiếu Lương (Payslip) phân rã từng dòng thu nhập minh bạch.

20. **Báo Cáo Phân Tích & Bảng Vinh Danh (Analytics & Leaderboards):**
    - Tổng hợp thành Biểu đồ đường (Line-chart) để Owner ra quyết định tài chính. Bên cạnh đó là Dashboard xếp hạng KPIs cho Nhân viên.

---

## 2. Cấu Trúc Giải Pháp & Công Nghệ

Dự án phân rã kiến trúc Monolithic chuẩn mực chia tầng Frontend và Backend:

### Frontend (Tương Tác UI/UX)
| Công nghệ | Mô tả |
|-----------|-------|
| **React 18** | Viết hoàn toàn bằng **TypeScript** |
| **Redux Toolkit** | Quản lý state tập trung, không đứt gãy khi chuyển trang |
| **Bootstrap 5** | CSS thuần + Flexbox, responsive trên mọi thiết bị |
| **Recharts** | Biểu đồ tài chính, thống kê trực quan |
| **Vercel** | Hosting production frontend (CDN toàn cầu) |

### Backend (Nền Tảng Logic & Data)
| Công nghệ | Mô tả |
|-----------|-------|
| **Java 21** | Ngôn ngữ chính, LTS ổn định |
| **Spring Boot 3.3** | Framework backend, Spring Security 6, Spring Data JPA |
| **Flyway** | Tự động migration database khi khởi chạy lần đầu |
| **Swagger/OpenAPI** | Tài liệu API tự động sinh |
| **Docker** | Container hóa ứng dụng cho deployment |
| **Render** | Hosting production backend (Docker container) |

### Database
| Công nghệ | Mô tả |
|-----------|-------|
| **MySQL 8.x** | Dùng cho môi trường local development |
| **TiDB Cloud Serverless** | Dùng cho môi trường production (tương thích MySQL) |

---

## 3. Kiến Trúc Triển Khai (Deployment Architecture)

```
┌─────────────────┐     HTTPS      ┌──────────────────┐     JDBC/TLS     ┌──────────────────┐
│                 │ ──────────────► │                  │ ───────────────► │                  │
│   Vercel CDN    │                 │  Render Docker   │                  │  TiDB Cloud      │
│   (Frontend)    │ ◄────────────── │  (Backend API)   │ ◄─────────────── │  (Database)      │
│                 │    JSON API     │                  │    Query Result  │                  │
│  React 18 SPA   │                 │  Spring Boot 3.3 │                  │  MySQL-compatible│
│  TypeScript     │                 │  Java 21         │                  │  Serverless      │
└─────────────────┘                 └──────────────────┘                  └──────────────────┘
```

### Luồng hoạt động:
1. **User** truy cập frontend trên **Vercel** (CDN phân tán toàn cầu, tải nhanh)
2. Frontend gọi API tới backend **Render** qua HTTPS
3. Backend xử lý logic nghiệp vụ và truy vấn **TiDB Cloud** (MySQL-compatible, serverless)
4. Kết quả trả về Frontend hiển thị cho người dùng

---

## 4. Hướng Dẫn Cài Đặt Local (Setup Guide)

### Yêu Cầu Môi Trường
1. **Node.js**: Cài đặt bản v18 hoặc v20 LTS.
2. **Java JDK 21**: Tải từ Oracle hoặc Adoptium. (*Rất quan trọng phải là JDK 21 để tương thích tốt nhất với thư viện Lombok trong code*).
3. **Maven**: Bản 3.8+ và được setup vào biến môi trường Path của OS.
4. **MySQL 8.x**: Đã cài đặt và đang chạy ngầm trên port 3306.

### Bước 1: Chuẩn bị Cơ Sở Dữ Liệu MySQL
Mở công cụ (MySQL Workbench/DBeaver hoặc Terminal), chạy dòng lệnh sau (Bạn chỉ cần tạo Database rỗng, các bảng sẽ tự được Flyway tạo):
```sql
CREATE DATABASE coffee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Khởi động Backend Spring Boot
**1. Tải source và vào thư mục**
```bash
git clone <repository_url>
cd parrtime-staff-management/backend
```

**2. Điều chỉnh biến môi trường (File cấu hình)**
Mở file bằng trình soạn thảo mã (VSCode): `src/main/resources/application.yml`.
Tìm tới đoạn Database và khai báo tài khoản MySQL của máy bạn:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/coffee_management?serverTimezone=Asia/Ho_Chi_Minh
    username: root          # <-- Điền User MySQL hệ thống bạn
    password: mysql_password # <-- Điền Password tương ứng
```
*(Hoặc bạn có thể dùng lệnh PowerShell để inject biến môi trường nếu không muốn sửa file)*:
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="mysql_password"
```

**3. Yêu Cầu Chạy JDK Bắt Buộc 21** (Trên Windows PowerShell)
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
```

**4. Compile và Chạy Backend**
```bash
# Tải đủ thư viện Maven và Biên dịch dự án
mvn clean install -DskipTests

# Chạy Server Backend (Mất tầm 20-30s cho lần đầu sinh bảng Database)
mvn spring-boot:run
```
✅ **Backend thành công khi Console báo**: `Tomcat started on port(s): 8080 (http)`

### Bước 3: Khởi động Frontend React
Mở một cửa sổ Terminal khác.
**1. Đi vào thư mục giao diện**
```bash
cd parrtime-staff-management/frontend
```

**2. Khai báo API URL kết nối tới Backend**
Tạo một file có tên đúng là `.env` đặt ngay ở gốc thư mục `frontend/`, điền vào dòng:
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

**3. Cài đặt các thư viện Node Modules**
```bash
npm install
```

**4. Chạy Giao Diện Web**
```bash
npm start
```
Browser sẽ tự mở lên tại địa chỉ: **http://localhost:3000**

---

## 5. Hướng Dẫn Triển Khai Production

Hệ thống đã được cấu hình sẵn để triển khai lên cloud với 3 dịch vụ:

### 5.1 Database — TiDB Cloud Serverless
1. Đăng ký tại [tidbcloud.com](https://tidbcloud.com)
2. Tạo cluster **Serverless** (miễn phí)
3. Lấy thông tin kết nối: `host`, `port`, `username`, `password`
4. Ghi chú: TiDB tương thích MySQL protocol, không cần thay đổi code

### 5.2 Backend — Render (Docker)
1. Đăng ký tại [render.com](https://render.com)
2. Tạo **Web Service** → chọn **Docker** → kết nối Git repository
3. Thiết lập **Root Directory**: `backend`
4. Thiết lập **Environment Variables**:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<tidb-host>:4000/<db-name>?useSSL=true&sslMode=VERIFY_IDENTITY
   SPRING_DATASOURCE_USERNAME=<tidb-username>
   SPRING_DATASOURCE_PASSWORD=<tidb-password>
   JWT_SECRET=<random-256bit-key>
   CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>
   ```
5. Backend sẽ tự build Docker image và deploy. Dockerfile nằm tại `backend/Dockerfile`

### 5.3 Frontend — Vercel
1. Đăng ký tại [vercel.com](https://vercel.com)
2. Import Git repository
3. Thiết lập:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Thiết lập **Environment Variables**:
   ```
   REACT_APP_API_URL=https://<your-render-backend>.onrender.com/api/v1
   ```
5. Vercel tự động deploy mỗi khi push code lên Git

### Lưu ý khi triển khai
- Backend trên Render (free tier) có thể mất **30-60 giây khởi động lần đầu** (cold start). Các request tiếp theo sẽ nhanh bình thường.
- TiDB Cloud Serverless cũng có cold start tương tự, nên cấu hình HikariCP đã được tối ưu trong `application-prod.yml`.
- File `vercel.json` đã cấu hình SPA rewrite để React Router hoạt động đúng.

---

## 6. Tài Khoản Demo Hệ Thống

Để người đánh giá hệ thống nhanh chóng trải nghiệm quy trình, khi Backend khởi động lần đầu, kịch bản Flyway (`V2__seed_demo_accounts.sql`) đã bơm cho bạn sẵn 30 tài khoản kết hợp dữ liệu mẫu.

Trên màn hình Đăng Nhập, bạn có thể TỰ BẤM vào các Nút Tài khoản Demo ở mảng phải để tự động điền form không cần gõ phím.

| Vai Trò Trải Nghiệm | Username Điền Bảng | Password | Ý nghĩa |
|---------------------|--------------------|----------|---------|
| **Cấp Cao Nhất Owner** | `owner` | `password123` | Quản trị mọi chi nhánh, xem báo cáo tổng, duyệt danh sách lương. |
| **Quản Lý Cơ Sở** | `managerA` | `password123` | Toàn quyền thao tác trên cơ sở "Hoàn Kiếm". |
| **Nhân Viên Cơ Sở** | `staff_a01` | `password123` | Nhân viên quầy phục vụ của cơ sở "Hoàn Kiếm". Dùng account này để checkin/tạo chợ ca. |

> Có tài khoản từ `staff_a01` tới `staff_a10`... tổng cộng 30 nhân viên. Thử sử dụng 2 trình duyệt khác nhau để đăng nhập test tương tác thời gian thực "Đổi Ca" giữa 2 Staff với nhau nhé!

---

💖 Hệ thống đã được triển khai trực tuyến và sẵn sàng cho môi trường ứng dụng thực tiễn với chi phí triển khai tối giản và tính tương thích cao cho doanh nghiệp F&B!
