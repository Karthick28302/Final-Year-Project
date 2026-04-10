from flask import Blueprint, request, jsonify
import face_recognition
import pickle
import os
import base64
import numpy as np
import cv2
from database import get_db_connection

register_bp = Blueprint("register", __name__)

ENCODINGS_PATH = "encodings/face_encodings.pkl"


@register_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name").strip().lower()
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No image provided"}), 400

    # 🔥 Convert base64 to image
    img_bytes = base64.b64decode(image_data.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    faces = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, faces)

    if len(encodings) == 0:
        return jsonify({"error": "No face detected"}), 400

    encoding = encodings[0]

    # Load existing encodings
    if os.path.exists(ENCODINGS_PATH):
        with open(ENCODINGS_PATH, "rb") as f:
            data = pickle.load(f)
    else:
        data = {"encodings": [], "names": []}

    data["encodings"].append(encoding)
    data["names"].append(name)

    with open(ENCODINGS_PATH, "wb") as f:
        pickle.dump(data, f)

    # Save user in DB
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("INSERT INTO users (name) VALUES (%s)", (name,))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User registered successfully"})