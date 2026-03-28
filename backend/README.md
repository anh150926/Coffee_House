# Coffee House - Backend Kiến Trúc & Dịch Vụ API

Dự án Backend đóng vai trò là lõi hệ thống xử lý nghiệp vụ, quản lý dữ liệu đa luồng (Database Management), cung cấp chuẩn giao tiếp RESTful API cho các client Frontend cũng như xử lý logic cốt lõi cho **20 tính năng quản lý nhân sự quán cà phê.**

## Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Java | 21 (LTS) | Ngôn ngữ chính |
| Spring Boot | 3.3.5 | Framework backend |
| Spring Security 6 | Latest | Xác thực & phân quyền JWT |
| Spring Data JPA | Latest | ORM layer |
| Flyway | Latest | Database migration tự động |
| Lombok | 1.18.38 | Giảm boilerplate code |
| Swagger/OpenAPI | 3.x | API documentation tự sinh |
| Docker | Multi-stage | Container hóa cho deployment |
| MySQL 8 | Local | Development database |
| TiDB Cloud | Serverless | Production database |

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

## Cấu Trúc Thư Mục

```
backend/
├── src/main/java/com/coffee/management/
│   ├── config/             # Spring Security, CORS, Swagger config
│   ├── controller/         # REST Controllers (20 endpoints)
│   │   ├── AuthController.java
│   │   ├── MarketplaceController.java
│   │   ├── ShiftController.java
│   │   └── ...
│   ├── dto/                # Data Transfer Objects
│   │   ├── ApiResponse.java        # Standard response wrapper
│   │   └── marketplace/            # Marketplace DTOs
│   ├── entity/             # JPA Entities
│   ├── exception/          # Custom exceptions + GlobalHandler
│   ├── repository/         # Spring Data JPA Repositories
│   ├── security/           # JWT + UserPrincipal
│   └── service/            # Business logic layer
├── src/main/resources/
│   ├── application.yml             # Local config
│   ├── application-prod.yml        # Production config (Render + TiDB)
│   └── db/migration/              # Flyway SQL scripts
├── Dockerfile                      # Multi-stage Docker build
└── pom.xml                         # Maven dependencies
```

---

## Hướng Dẫn Cài Đặt & Chạy

### Chạy Local (Development)

#### Bước 1: Tạo Database MySQL
```sql
CREATE DATABASE coffee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Bước 2: Cấu hình (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/coffee_management?serverTimezone=Asia/Ho_Chi_Minh
    username: ${DB_USERNAME:root}       # Đổi thành user MySQL của bạn
    password: ${DB_PASSWORD:123456}     # Đổi thành password MySQL của bạn
```

#### Bước 3: Đặt JDK 21 (Bắt buộc)
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
```

> **⚠️ Lưu Ý:** Code bắt buộc dùng **JDK 21**. Nếu máy cài JDK 24, Lombok sẽ báo lỗi `ExceptionInInitializerError TypeTag UNKNOWN`.

#### Bước 4: Build & Chạy
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

✅ Server Online tại: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

Flyway sẽ tự động tạo tables và seed 30 tài khoản demo khi chạy lần đầu.

---

### Triển Khai Production (Render + TiDB)

Backend đã được cấu hình sẵn với **Dockerfile** multi-stage và **application-prod.yml** để chạy trên cloud.

#### Database: TiDB Cloud Serverless
1. Tạo cluster tại [tidbcloud.com](https://tidbcloud.com) (miễn phí)
2. TiDB tương thích MySQL protocol — không cần thay đổi code
3. Lưu ý: Schema được quản lý bởi `hibernate.ddl-auto: update` (Flyway tắt trên prod)

#### Backend: Render (Docker)
1. Tạo **Web Service** trên [render.com](https://render.com)
2. Kết nối Git repository, đặt **Root Directory**: `backend`
3. Chọn **Docker** runtime
4. Thiết lập **Environment Variables**:

| Biến | Giá trị | Mô tả |
|------|---------|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:4000/<db>?useSSL=true&sslMode=VERIFY_IDENTITY` | TiDB connection string |
| `SPRING_DATASOURCE_USERNAME` | `<tidb-user>` | TiDB username |
| `SPRING_DATASOURCE_PASSWORD` | `<tidb-password>` | TiDB password |
| `JWT_SECRET` | `<random-256bit-key>` | JWT signing key |
| `CORS_ALLOWED_ORIGINS` | `https://<vercel-domain>` | Frontend URL |

5. Render tự động build Docker image từ `Dockerfile` và deploy

#### Dockerfile (Multi-stage Build)
```dockerfile
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/management-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
```

#### Đặc điểm Production Config (`application-prod.yml`)
- **HikariCP** tối ưu cho TiDB cold start (connection-timeout: 30s, pool: 15)
- **JWT** hạn 1 giờ (tăng bảo mật so với local 24h)
- **Swagger/OpenAPI** TẮT hoàn toàn trên production
- **Logging** chỉ ghi INFO, không leak SQL/data

#### Lưu ý quan trọng
- Render free tier có **cold start** ~30-60 giây cho request đầu tiên
- TiDB Serverless cũng có cold start tương tự — HikariCP đã được cấu hình keepalive
- Leak detection threshold: 60s (cảnh báo connection leak)

---

## 📚 API Documentation

### Local Development
Truy cập Swagger UI: **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Quy Trình Sử Dụng Swagger
1. Gọi `POST /api/v1/auth/login` với body: `{"username":"managerA", "password":"password123"}`
2. Copy `accessToken` từ response
3. Bấm nút **Authorize** (hình ổ khóa) → dán `Bearer <accessToken>`
4. Tất cả endpoints đều hoạt động với quyền của tài khoản đã đăng nhập

> **Lưu ý:** Swagger bị TẮT trên production để bảo mật. Chỉ sử dụng được trên local development.
