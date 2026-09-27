# BloodConnect
🩸 BloodConnect — A cloud-based blood bank management system connecting donors, blood banks, and hospitals on one platform for real-time stock visibility, automated alerts, and faster emergency response.

## Run the connected frontend and API

1. Open the repository in IntelliJ IDEA and load `backend/pom.xml` as a Maven project.
2. Run `./backend/run-dev.sh` (the default `dev` profile uses an in-memory H2 database).
3. Open `http://localhost:8080/`. The UI and REST API are served by the same Spring Boot app.

For persistent MySQL storage, set `SPRING_PROFILES_ACTIVE=mysql`, `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in an untracked `.env` file (see `.env.example`). Hibernate creates/updates tables using `ddl-auto=update`.

## Backend API

JSON endpoints are rooted at `/api`: `GET /health`; CRUD `/donors`, `/hospitals`, `/inventory`, and `/requests`; `GET /transactions`; `GET /notifications`; `GET`/`PUT /settings`; `GET /dashboard`; and `GET /reports/summary`. Inventory additions create donation transactions. Marking a blood request `Fulfilled` allocates available stock by earliest expiry date and records an issue transaction atomically; insufficient stock returns HTTP 409. Notifications reflect low inventory, expiry within three days, and pending requests, subject to the configured notification preferences.
