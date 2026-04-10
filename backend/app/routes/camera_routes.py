from flask import Blueprint, Response, jsonify

from backend.app.services.camera_service import generate_frames, get_camera_status

camera_bp = Blueprint("camera", __name__)


@camera_bp.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@camera_bp.route("/camera/status", methods=["GET"])
def camera_status():
    return jsonify(get_camera_status())
