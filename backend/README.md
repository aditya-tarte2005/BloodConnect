# BloodConnect API

Spring Boot REST API module for the existing static frontend.

## Stack

- Java 21
- Spring Boot 3.0.0
- Spring Data JPA / Hibernate
- MySQL

**Java compatibility note:** Spring Boot 3.0.0 documents compatibility through Java 19. This project uses the installed JDK 21 to run Maven and the application, but compiles to Java 19 bytecode because the 3.0.0 Maven plugin rejects Java 21 class files. This avoids a framework version change for the first UI/API connection; use Spring Boot 3.0.13 to target Java 21 bytecode with documented support.

## Open in IntelliJ IDEA

Open the repository root in IntelliJ IDEA, then open `backend/pom.xml` and choose **Load Maven Project**. Set the Project SDK to JDK 21 in Project Structure. IntelliJ's Maven integration can resolve Maven and project dependencies; a separate system Maven installation is not required for IDE use.

## Configure MySQL

For the first frontend-to-API connection, run without `.env`; the default `dev` profile starts the API without requiring MySQL. To enable the existing local MySQL database, copy the root `.env.example` to `.env`, set the account credentials, and leave `SPRING_PROFILES_ACTIVE=mysql`. The `.env` file is ignored by Git. The application creates the `bloodconnect` schema on first connection when the account has permission.

```text
DB_URL=jdbc:mysql://localhost:3306/bloodconnect?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your-local-password
```

For local development Hibernate updates the schema automatically. Use versioned migrations before deploying or sharing persistent data.

Run `./backend/run-dev.sh` from the repository root to start with JDK 21. The build also packages the existing frontend files as Spring static resources, so open `http://localhost:8080/`; the dashboard calls `GET /api/health`. In IntelliJ IDEA, set the Project SDK to `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`, import `backend/pom.xml` as a Maven project, and create a Spring Boot run configuration for `com.bloodconnect.BloodConnectApplication`.

The health endpoint is `GET http://localhost:8080/api/health`.

The API module is currently a foundation only; domain endpoints, authentication, and frontend integration are the next implementation steps.
