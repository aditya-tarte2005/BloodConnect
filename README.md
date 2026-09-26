# BloodConnect
🩸 BloodConnect — A cloud-based blood bank management system connecting donors, blood banks, and hospitals on one platform for real-time stock visibility, automated alerts, and faster emergency response.

## Run the connected frontend and API

1. Copy `.env.example` to `.env` and set the local MySQL username/password.
2. Open the repository in IntelliJ IDEA and load `backend/pom.xml` as a Maven project.
3. Run `./backend/run-dev.sh`.
4. Open `http://localhost:8080/`. The dashboard checks `GET /api/health` and shows the backend connection state.

For the initial frontend-to-API connection without MySQL credentials, remove `SPRING_PROFILES_ACTIVE=mysql` from `.env` or run without `.env`; the default `dev` profile starts only the API and static UI.
