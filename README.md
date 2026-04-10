# Smart Attendance System

Face-recognition attendance tracking with a React frontend and Flask backend.

## Setup

### 1. Database
Create schema and seed data:

```sql
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_system
SECRET_KEY=your_long_random_secret
```

Run backend from project root:

```bash
python -m backend.main
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

If needed, create `frontend/.env`:

```env
REACT_APP_API_URL=http://127.0.0.1:5000
```

## Default Admin Login

- Username: `admin`
- Password: `admin123`

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Service banner |
| GET | `/health` | Health check |
| POST | `/api/login` | Admin login |
| POST | `/register` | Register new face |
| GET | `/attendance` | Attendance records (`?from=&to=` optional) |
| GET | `/attendance/stats` | Today's attendance stats |
| GET | `/export` | Download Excel report |
| GET | `/video_feed` | Camera MJPEG stream |
| GET | `/camera/status` | Camera availability/open state |

## Testing

Run backend smoke tests from project root:

```bash
python -m pytest backend/tests/test_smoke.py -q
```

## Notes

- Test `GET` routes in browser directly.
- Test `POST` routes (`/api/login`, `/register`) using Thunder Client or frontend forms.
- `GET /api/login` returning `405` is expected because login is POST-only.
