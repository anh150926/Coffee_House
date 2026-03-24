# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml và tải dependencies (tối ưu cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy file jar từ Stage 1
COPY --from=build /app/target/management-1.0.0.jar app.jar

# Mở port 8080
EXPOSE 8080

# Chạy ứng dụng với profile "prod"
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
