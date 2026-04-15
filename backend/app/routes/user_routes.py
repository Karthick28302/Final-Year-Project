from flask import Blueprint, request, jsonify

from backend.app.services.registration_service import register_user_from_image

from backend.app.models.user_model import get_all_users

from backend.app.models.user_model import get_all_users, get_user_by_id
from backend.app.models.attendance_model import get_user_attendance_summary

user_bp = Blueprint("users", __name__)


@user_bp.route("/register", methods=["POST"])
def register_user():
    body = request.json or {}
    name = body.get("name", "")
    image_data = body.get("image", "")

    response, status_code = register_user_from_image(name, image_data)
    return jsonify(response), status_code

@user_bp.route("/users", methods=["GET"])
def list_users():
    users = get_all_users()
    return jsonify(users), 200

@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_details(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    summary = get_user_attendance_summary(user_id) or {}
    return jsonify({
        "user": user,
        "summary": {
            "total_records": summary.get("total_records", 0) or 0,
            "today_records": summary.get("today_records", 0) or 0,
            "currently_present": summary.get("currently_present", 0) or 0,
        }
    }), 200
