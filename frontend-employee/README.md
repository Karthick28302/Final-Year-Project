# Employee Portal (Non-Admin)

This folder contains the non-admin employee portal UI and its dedicated backend.

## Features

- Employee login with JWT auth
- Protected employee APIs (`/api/v1/me/*`)
- Dashboard, profile, attendance, salary, events, and holidays pages
- Attendance and salary filters (`month`, `year`)
- Profile view and edit flow
- Backend test suite for auth, profile, and `/me/*` authorization checks

## API Base URL

The frontend now reads API base URL from:

- `REACT_APP_EMPLOYEE_API_URL`

Example:

```env
REACT_APP_EMPLOYEE_API_URL=http://localhost:5001/api/v1
```

If this value is not set, default is `http://localhost:5000/api/v1` in code. For this module, use port `5001`.

## Backend Environment

Create/update `frontend-employee/backend/.env`:

```env
PORT=5001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/employee_portal
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

Note:
- `5433` is used when Docker maps host `5433 -> container 5432`.
- If you map `5432:5432`, then use `localhost:5432` instead.

## Database Setup (Docker PostgreSQL)

1. Start Docker Desktop.
2. Create/start PostgreSQL container:

```bash
docker run --name employee-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=employee_portal -p 5433:5432 -d postgres:16
```

If container already exists:

```bash
docker start employee-postgres
```

3. Initialize schema + seed data (uses PostgreSQL-specific SQL in `frontend-employee/database`):

```bash
cd frontend-employee/backend
node scripts/init-db.js
```

## Run Locally

1. Start employee backend

```bash
cd frontend-employee/backend
npm install
npm run dev
```

2. Start employee frontend

```bash
cd frontend-employee
npm install
npm start
```

3. Open the app:

- `http://localhost:3000/login`

## Test Credentials

- Employee Code: `EMP1001`
- Password: `Emp@12345`

## API Smoke Check

1. Login:

`POST http://localhost:5001/api/v1/auth/login`

```json
{
  "identifier": "EMP1001",
  "password": "Emp@12345"
}
```

2. Use returned token as header for protected endpoints:

`Authorization: Bearer <token>`

3. Protected endpoints:

- `GET /api/v1/me/profile`
- `GET /api/v1/me/attendance`
- `GET /api/v1/me/salary`
- `GET /api/v1/me/events`
- `GET /api/v1/me/holidays`

## Run Backend Tests

```bash
cd frontend-employee/backend
npm test
```

Expected current result:
- 10 tests passed, 0 failed.
