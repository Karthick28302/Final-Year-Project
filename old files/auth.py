from flask import Blueprint, request, jsonify
from database import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM admins WHERE username=%s AND password=%s",
        (username, password)
    )

    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    if admin:
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401