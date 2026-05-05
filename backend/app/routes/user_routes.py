from flask import Blueprint, request, jsonify

from backend.app.services.registration_service import register_user_from_image
from backend.app.models.user_model import (
    get_all_users,
    get_user_by_id,
    update_user_compensation,
    delete_user_by_id,
)
from backend.app.models.attendance_model import get_user_attendance_summary
from backend.app.services.face_recognition_service import reload_encodings
from backend.app.utils.face_utils import remove_encodings_for_name

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


@user_bp.route("/users/<int:user_id>/compensation", methods=["PUT"])
def update_compensation(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    body = request.json or {}

    try:
        monthly_salary = float(body.get("monthly_salary", 0))
        pf_percent = float(body.get("pf_percent", 0))
        savings_percent = float(body.get("savings_percent", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid compensation values"}), 400

    if monthly_salary < 0:
        return jsonify({"error": "monthly_salary cannot be negative"}), 400
    if not 0 <= pf_percent <= 100:
        return jsonify({"error": "pf_percent must be between 0 and 100"}), 400
    if not 0 <= savings_percent <= 100:
        return jsonify({"error": "savings_percent must be between 0 and 100"}), 400

    updated = update_user_compensation(
        user_id=user_id,
        monthly_salary=monthly_salary,
        pf_percent=pf_percent,
        savings_percent=savings_percent,
    )
    if not updated:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "Compensation updated"}), 200


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    deleted = delete_user_by_id(user_id)
    if not deleted:
        return jsonify({"error": "User not found"}), 404

    # Remove this name from in-memory and persisted encodings.
    try:
        remove_encodings_for_name(user["name"])
        reload_encodings()
    except Exception as exc:
        print(f"[users.delete_user] warning: encoding cleanup failed: {exc}")

    return jsonify({"message": f"User '{user['name']}' deleted"}), 200
