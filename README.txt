BLOODCONNECT FRONTEND AND SPRING BOOT API

1. Copy .env.example to .env and set your local MySQL username/password.
2. Open this folder in IntelliJ IDEA and load backend/pom.xml as a Maven project.
3. Run ./backend/run-dev.sh.
4. Open http://localhost:8080/ in your browser.

The dashboard checks its connection to the Spring Boot API at /api/health. Other screens still use demo data until their API workflows are connected.
