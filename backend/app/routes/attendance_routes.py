from flask import Blueprint, request, jsonify

from backend.app.models.attendance_model import (
    get_all_attendance,
    get_attendance_by_date,
    get_stats_today,
)
from backend.app.services.attendance_service import calculate_duration

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/attendance", methods=["GET"])
def get_attendance():
    from_date = request.args.get("from")
    to_date = request.args.get("to")

    if from_date and to_date:
        records = get_attendance_by_date(from_date, to_date)
    else:
        records = get_all_attendance()

    for record in records:
        record["duration"] = calculate_duration(record["login_time"], record["logout_time"])
        record["login_time"] = record["login_time"].isoformat() if record["login_time"] else None
        record["logout_time"] = record["logout_time"].isoformat() if record["logout_time"] else None

    return jsonify(records)


@attendance_bp.route("/attendance/stats", methods=["GET"])
def get_stats():
    stats = get_stats_today()
    return jsonify({
        "total_today": stats["total_today"] or 0,
        "currently_present": stats["currently_present"] or 0,
    })
