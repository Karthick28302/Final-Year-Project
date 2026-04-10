import os
import pickle
from backend.app.config import ENCODINGS_PATH



def load_encodings() -> dict:
    """
    Load face encodings from disk.
    Returns {"encodings": [...], "names": [...]}
    Returns empty dict if file not found (first run before any registration).
    """
    if not os.path.exists(ENCODINGS_PATH):
        print(f"[face_utils] No encodings file at {ENCODINGS_PATH}. Register users first.")
        return {"encodings": [], "names": []}

    with open(ENCODINGS_PATH, "rb") as f:
        return pickle.load(f)


def save_encodings(data: dict):
    """
    Persist face encodings to disk.
    data must be {"encodings": [...], "names": [...]}
    """
    os.makedirs(os.path.dirname(ENCODINGS_PATH), exist_ok=True)
    with open(ENCODINGS_PATH, "wb") as f:
        pickle.dump(data, f)
    print(f"[face_utils] Encodings saved to {ENCODINGS_PATH}")


def append_encoding(name: str, encoding):
    """Add a single new encoding+name to the existing pickle file."""
    data = load_encodings()
    data["encodings"].append(encoding)
    data["names"].append(name.strip().lower())
    save_encodings(data)