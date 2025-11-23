# =============================
# 1. BUILD STAGE (MAVEN)
# =============================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy POM first → cache dependencies
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Copy source
COPY src ./src

# Build JAR
RUN mvn -B -DskipTests clean package


# =============================
# 2. RUNTIME STAGE (DISTROLESS)
# =============================
FROM gcr.io/distroless/java17-debian11:nonroot

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
USER nonroot
CMD ["app.jar"]
