import base64
import cv2
import face_recognition
import numpy as np

from backend.app.models.user_model import create_user, user_exists
from backend.app.utils.face_utils import append_encoding
from backend.app.services.face_recognition_service import reload_encodings


def register_user_from_image(name: str, image_data: str):
    name = name.strip().lower()

    if not name:
        return {"error": "Name is required"}, 400

    if not image_data:
        return {"error": "No image provided"}, 400

    if user_exists(name):
        return {"error": f"User '{name}' is already registered"}, 409

    try:
        img_bytes = base64.b64decode(image_data.split(",")[1])
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    except Exception:
        return {"error": "Invalid image data"}, 400

    faces = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, faces)

    if not encodings:
        return {"error": "No face detected in image"}, 400

    append_encoding(name, encodings[0])
    create_user(name)
    reload_encodings()

    return {"message": f"User '{name}' registered successfully"}, 201
