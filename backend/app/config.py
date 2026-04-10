import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

try:
    from dotenv import load_dotenv
    # Always load backend/.env, regardless of current working directory.
    load_dotenv(ENV_PATH)
except ImportError:
    pass

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "attendance_system"),
}

SECRET_KEY = os.getenv("SECRET_KEY", "")
ENCODINGS_PATH = os.getenv(
    "ENCODINGS_PATH",
    os.path.join(BASE_DIR, "encodings", "face_encodings.pkl"),
)
DATASET_PATH = os.getenv(
    "DATASET_PATH",
    os.path.join(BASE_DIR, "dataset"),
)
LOGOUT_DELAY = int(os.getenv("LOGOUT_DELAY", 5))


def validate_config():
    missing = []
    placeholder_like = []

    if not SECRET_KEY:
        missing.append("SECRET_KEY")

    if not DB_CONFIG["password"]:
        missing.append("DB_PASSWORD")

    if DB_CONFIG["password"] and "<" in DB_CONFIG["password"]:
        placeholder_like.append("DB_PASSWORD")

    if SECRET_KEY and "<" in SECRET_KEY:
        placeholder_like.append("SECRET_KEY")

    if missing:
        raise RuntimeError(
            "Missing required environment variables: " + ", ".join(missing)
        )

    if placeholder_like:
        raise RuntimeError(
            "Placeholder values detected in .env for: "
            + ", ".join(placeholder_like)
            + ". Replace them with real values."
        )
