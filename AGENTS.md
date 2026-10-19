# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: Spring Boot API.
  - `src/main/java/com/copconnect/`: Controllers, services, security, entities, repositories.
  - `src/main/resources/`: `application.properties` and runtime config.
- `frontend/`: Expo (React Native) app.
  - `app/`: Expo Router screens grouped by role (`(auth)`, `(user)`, `(officer)`, `(admin)`).
  - `components/`, `context/`, `services/`, `assets/`, `global.css`.

## Build, Test, and Development Commands
- Backend (from `backend/`):
  - `mvn spring-boot:run` — run the API on the configured port (default `9090`).
  - `mvn test` — run backend tests (none are currently present).
  - `mvn -DskipTests package` — build the JAR.
- Frontend (from `frontend/`):
  - `npm install` — install dependencies.
  - `npm start` or `npx expo start` — start Expo dev server.
  - `npm run android | ios | web` — launch a specific platform.

## Coding Style & Naming Conventions
- Java: 4‑space indentation, standard Spring Boot conventions; keep class names in PascalCase.
- TypeScript/React Native: 4‑space indentation, double quotes observed in files; keep components in PascalCase and hooks in `useX` form.
- No formatter/linter config is checked in; match existing file style and keep imports sorted and minimal.

## Testing Guidelines
- Backend testing uses `spring-boot-starter-test` when added; place tests under `backend/src/test/java`.
- Frontend tests are not configured; if adding, use `__tests__/` near feature folders or a top-level `tests/`.

## Commit & Pull Request Guidelines
- This workspace is not a git repository, so no historical commit conventions are available.
- If you initialize git, use short, imperative messages (e.g., `Add officer dashboard filters`).
- PRs should include: a concise summary, key screenshots for UI changes, and linked issues when applicable.

## Security & Configuration Tips
- `backend/src/main/resources/application.properties` contains local MySQL credentials; avoid committing real secrets.
- Prefer environment-specific overrides (e.g., `application-local.properties`) or environment variables for credentials.

## Agent-Specific Instructions
- Keep changes scoped to `backend/` or `frontend/` and update this guide if structure or commands change.
