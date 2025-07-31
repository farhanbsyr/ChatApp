# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy semua file proyek
COPY . .

# Pastikan mvnw executable
RUN chmod +x mvnw

# Build jar menggunakan Maven wrapper (skip tests)
RUN ./mvnw clean package -DskipTests

# Stage 2: Run JAR
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy hasil build dari stage sebelumnya
COPY --from=build /app/target/*.jar app.jar

# Jalankan aplikasi
ENTRYPOINT ["java", "-jar", "app.jar"]
