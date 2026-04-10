from flask import Blueprint, request, jsonify

from backend.app.services.registration_service import register_user_from_image

user_bp = Blueprint("users", __name__)


@user_bp.route("/register", methods=["POST"])
def register_user():
    body = request.json or {}
    name = body.get("name", "")
    image_data = body.get("image", "")

    response, status_code = register_user_from_image(name, image_data)
    return jsonify(response), status_code
